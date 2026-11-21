const Job = require('../models/Job');
const UserPreference = require('../models/UserPreference');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Calculates deterministic match score & skills between candidate skills & job skills.
 */
const calculateLocalScore = (candidateSkillsArr, jobSkillsStr, jobLocation, prefLocation, jobType, prefJobType) => {
  if (!jobSkillsStr) return { score: 50, matchingSkills: [], missingSkills: [] };

  const jobSkillsArr = jobSkillsStr.split(',').map(s => s.trim()).filter(Boolean);
  if (jobSkillsArr.length === 0) return { score: 50, matchingSkills: [], missingSkills: [] };

  const candSkillsLower = candidateSkillsArr.map(s => s.toLowerCase());

  const matchingSkills = [];
  const missingSkills = [];

  jobSkillsArr.forEach(js => {
    const jsLower = js.toLowerCase();
    const isMatch = candSkillsLower.some(cs => cs.includes(jsLower) || jsLower.includes(cs));
    if (isMatch) {
      matchingSkills.push(js);
    } else {
      missingSkills.push(js);
    }
  });

  const skillRatio = matchingSkills.length / jobSkillsArr.length;
  let score = Math.round(skillRatio * 80); // Up to 80 points for skills match

  // Location bonus (10 points)
  if (prefLocation && jobLocation && jobLocation.toLowerCase().includes(prefLocation.toLowerCase())) {
    score += 10;
  } else if (!prefLocation) {
    score += 5;
  }

  // Job Type bonus (10 points)
  if (prefJobType && jobType && jobType.toLowerCase() === prefJobType.toLowerCase()) {
    score += 10;
  } else if (!prefJobType) {
    score += 5;
  }

  score = Math.min(100, Math.max(10, score));

  return { score, matchingSkills, missingSkills };
};

/**
 * @desc Get AI Job Recommendations for authenticated user
 * @route GET /api/ai/job-recommendations
 * @access Private
 */
const getJobRecommendations = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // 1. Gather candidate skills/details from profile & user_preferences
    const userPref = await UserPreference.findByUserId(user.id);
    
    let candidateSkills = [];
    if (user.skills) {
      if (Array.isArray(user.skills)) candidateSkills.push(...user.skills);
      else if (typeof user.skills === 'string') candidateSkills.push(...user.skills.split(','));
    }

    if (userPref && userPref.skills) {
      const prefSkills = userPref.skills.split(',').map(s => s.trim());
      candidateSkills.push(...prefSkills);
    }

    // Remove duplicates & clean up empty strings
    candidateSkills = Array.from(new Set(candidateSkills.map(s => String(s).trim()))).filter(Boolean);

    // 2. Get available jobs from database
    const allJobs = await Job.findAll();
    if (!allJobs || allJobs.length === 0) {
      return res.status(200).json({
        success: true,
        recommendations: [],
        message: 'No jobs available for recommendation.'
      });
    }

    // 3. Pre-score jobs using local matching algorithm to filter top candidates
    const scoredJobs = allJobs.map(job => {
      const { score, matchingSkills, missingSkills } = calculateLocalScore(
        candidateSkills,
        job.skills,
        job.location,
        userPref?.preferred_location,
        job.job_type,
        userPref?.job_type
      );

      let defaultReason = matchingSkills.length > 0
        ? `Matches your skills in ${matchingSkills.slice(0, 3).join(', ')}.`
        : `Role matches general technical profile in ${job.location || 'your domain'}.`;

      return {
        jobId: job.id,
        title: job.title,
        company: job.company_name,
        location: job.location,
        salary: job.salary,
        jobType: job.job_type,
        experience: job.experience,
        description: job.description,
        matchScore: score,
        matchingSkills,
        missingSkills,
        reason: defaultReason
      };
    });

    // Sort by match score descending
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    // Pick top 5 jobs for semantic enrichment via Gemini AI
    const topCandidates = scoredJobs.slice(0, 5);
    const remainingCandidates = scoredJobs.slice(5, 10);

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here' && topCandidates.length > 0) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are an expert AI Career Assistant.
Candidate Profile:
- Skills: ${candidateSkills.length > 0 ? candidateSkills.join(', ') : 'Software Engineering, General Tech'}
- Preferred Role: ${userPref?.preferred_role || 'Developer/Engineer'}

Analyze these 5 pre-filtered jobs and refine the matchScore (0-100) and reason (1 short sentence explaining why it's a good match) for each:
${JSON.stringify(topCandidates.map(j => ({ jobId: j.jobId, title: j.title, company: j.company, requiredSkills: j.matchingSkills.concat(j.missingSkills), currentScore: j.matchScore })))}

Return ONLY a valid JSON array of objects with keys: "jobId", "matchScore", "reason". No markdown formatting.
`;

        const aiResponse = await model.generateContent(prompt);
        let responseText = aiResponse.response.text().trim();
        if (responseText.startsWith('```')) {
          responseText = responseText.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
        }

        const aiResults = JSON.parse(responseText);
        if (Array.isArray(aiResults)) {
          aiResults.forEach(item => {
            const target = topCandidates.find(tc => tc.jobId === item.jobId);
            if (target) {
              if (typeof item.matchScore === 'number') target.matchScore = Math.min(100, Math.max(10, item.matchScore));
              if (item.reason) target.reason = item.reason;
            }
          });
        }
      } catch (aiErr) {
        console.warn('Gemini AI Job Ranking Fallback:', aiErr.message);
        // Seamless fallback to deterministic matching if Gemini fails/quota exceeded
      }
    }

    // Combine top candidates and remaining to get top 10 recommendations
    const finalRecommendations = [...topCandidates, ...remainingCandidates]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      count: finalRecommendations.length,
      recommendations: finalRecommendations
    });
  } catch (error) {
    console.error('Job Recommendation Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching job recommendations.',
      error: error.message
    });
  }
};

module.exports = { getJobRecommendations };
