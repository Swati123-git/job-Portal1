/**
 * resumeController.js
 * Controller for AI Resume Analysis feature.
 *
 * Route: POST /api/ai/analyze-resume
 * Access: Public (no auth required — anyone can analyze a resume)
 */

const { extractTextFromResume, sanitizeText } = require('../utils/extractText');
const { analyzeResumeWithAI } = require('../utils/geminiService');

// @desc    Analyze an uploaded resume using AI
// @route   POST /api/ai/analyze-resume
// @access  Public
const analyzeResume = async (req, res) => {
  try {
    // 1. Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload a PDF or DOCX resume file.'
      });
    }

    const { originalname, buffer, mimetype, size } = req.file;

    // 2. Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum allowed size is 5MB.'
      });
    }

    // 3. Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExt = '.' + originalname.split('.').pop().toLowerCase();

    if (!allowedMimeTypes.includes(mimetype) && !allowedExtensions.includes(fileExt)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.'
      });
    }

    console.log(`📄 Analyzing resume: ${originalname} (${(size / 1024).toFixed(0)} KB)`);

    // 4. Extract text from PDF / DOCX
    let extractedText;
    try {
      extractedText = await extractTextFromResume(buffer, originalname);
    } catch (extractError) {
      return res.status(422).json({
        success: false,
        message: `Could not extract text from file: ${extractError.message}`
      });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(422).json({
        success: false,
        message: 'Resume appears to be empty or unreadable. Please upload a text-based PDF or DOCX.'
      });
    }

    // 5. Sanitize the extracted text
    const sanitizedText = sanitizeText(extractedText);

    // 6. Send to Gemini AI for analysis
    let analysisResult;
    try {
      analysisResult = await analyzeResumeWithAI(sanitizedText);
    } catch (aiError) {
      console.error('AI Analysis Error:', aiError.message);

      // Check if it's a missing API key error
      if (aiError.message.includes('GEMINI_API_KEY')) {
        return res.status(503).json({
          success: false,
          message: 'AI service is not configured. Please add GEMINI_API_KEY to your backend .env file.',
          configError: true
        });
      }

      return res.status(503).json({
        success: false,
        message: 'AI analysis failed. Please try again in a moment.',
        error: aiError.message
      });
    }

    // 7. Validate the AI response has minimum required fields
    if (!analysisResult || typeof analysisResult.score !== 'number') {
      return res.status(503).json({
        success: false,
        message: 'AI returned an incomplete response. Please try again.'
      });
    }

    console.log(`✅ Resume analyzed. Score: ${analysisResult.score}`);

    // 8. Return the structured analysis to frontend
    return res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully!',
      data: analysisResult
    });

  } catch (error) {
    console.error('Resume Analyzer Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during resume analysis.',
      error: error.message
    });
  }
};

module.exports = { analyzeResume };
