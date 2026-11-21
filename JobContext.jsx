import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { mockJobs } from '../data/mockJobs';
import { useToast } from './ToastContext';
import { jobsAPI, applicationsAPI, savedJobsAPI } from '../services/api';
import confetti from 'canvas-confetti';

const JobContext = createContext(null);

// ─── DEFAULT FALLBACK DATA (used when backend is offline) ───────────────────
const DEFAULT_APPLICATIONS = [
  {
    id: "app-101",
    jobId: "job-1",
    jobTitle: "Senior Full Stack React & Node Engineer",
    company: "TechCorp Global",
    companyId: "techcorp",
    companyInitials: "TC",
    companyLogoBg: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    location: "San Francisco, CA",
    salary: "$140k - $175k / year",
    jobType: "Full-Time",
    appliedDate: "2026-08-21",
    status: "Interview Scheduled",
    stageIndex: 2,
    notes: "Technical phone screen scheduled for Thursday, Aug 28 at 2:00 PM PST.",
    resumeUsed: "Alex_Morgan_Senior_Frontend_Resume_2026.pdf",
    coverLetterSnippet: "Excited to contribute to TechCorp's high-scale cloud dashboard using modern React 19 architecture...",
    timeline: [
      { status: "Applied", date: "Aug 21, 2026", note: "Application and resume received." },
      { status: "Under Review", date: "Aug 22, 2026", note: "Profile screened by engineering talent team." },
      { status: "Interview Scheduled", date: "Aug 23, 2026", note: "Invited for 45-minute live technical discussion." }
    ]
  },
  {
    id: "app-102",
    jobId: "job-3",
    jobTitle: "AI Research & Machine Learning Engineer",
    company: "QuantumAI Labs",
    companyId: "quantum-ai",
    companyInitials: "QA",
    companyLogoBg: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    location: "New York, NY",
    salary: "$180k - $230k / year",
    jobType: "Full-Time",
    appliedDate: "2026-08-19",
    status: "Under Review",
    stageIndex: 1,
    notes: "Application forwarded to Principal Research Director.",
    resumeUsed: "Alex_Morgan_Senior_Frontend_Resume_2026.pdf",
    coverLetterSnippet: "Longtime admirer of QuantumAI's research into multimodal reasoning architectures...",
    timeline: [
      { status: "Applied", date: "Aug 19, 2026", note: "Application submitted via JobSphere." },
      { status: "Under Review", date: "Aug 20, 2026", note: "Under hiring manager review." }
    ]
  }
];

const DEFAULT_SAVED_JOB_IDS = ["job-2", "job-11"];

// Helper: check if user is a real backend-authenticated user
const isRealUser = () => !!localStorage.getItem('jobsphere_token');

// Helper: map backend application object → frontend shape
const mapBackendApplication = (app) => ({
  id: String(app.id),
  jobId: String(app.job_id),
  jobTitle: app.title || app.jobTitle || 'Unknown Job',
  company: app.company_name || app.company || 'Unknown Company',
  companyId: String(app.employer_id || ''),
  companyInitials: (app.company_name || app.company || 'UK').substring(0, 2).toUpperCase(),
  companyLogoBg: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  location: app.location || '',
  salary: app.salary || '',
  jobType: app.job_type || 'Full-Time',
  appliedDate: app.applied_at ? app.applied_at.split('T')[0] : new Date().toISOString().split('T')[0],
  status: app.status || 'Applied',
  stageIndex: ['Applied', 'Shortlisted', 'Rejected', 'Selected'].indexOf(app.status || 'Applied'),
  notes: app.cover_letter ? app.cover_letter.substring(0, 100) + '...' : 'Application received.',
  resumeUsed: app.resume || 'Resume.pdf',
  coverLetterSnippet: app.cover_letter || '',
  timeline: [
    { status: 'Applied', date: new Date(app.applied_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), note: 'Application submitted via JobSphere.' }
  ]
});

// Helper: map backend job object → frontend shape
const mapBackendJob = (job) => ({
  id: String(job.id),
  title: job.title,
  company: job.company_name,
  companyId: String(job.employer_id || ''),
  companyInitials: (job.company_name || 'UK').substring(0, 2).toUpperCase(),
  companyLogoBg: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
  location: job.location || '',
  workplaceType: job.job_type === 'Remote' ? 'Remote' : 'Onsite',
  category: 'tech-dev',
  categoryName: 'Software & Engineering',
  jobType: job.job_type || 'Full-Time',
  experience: job.experience || 'Entry Level',
  salaryMin: 0,
  salaryMax: parseInt(job.salary) || 100000,
  salary: job.salary || 'Competitive',
  featured: false,
  urgent: false,
  postedDate: job.created_at ? job.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  postedAgo: 'Recently',
  applicantsCount: 0,
  description: job.description || '',
  responsibilities: [],
  requirements: job.skills ? job.skills.split(',').map(s => s.trim()) : [],
  skills: job.skills ? job.skills.split(',').map(s => s.trim()) : [],
  deadline: job.deadline || '',
});

export const JobProvider = ({ children }) => {
  const { showToast } = useToast();

  const [jobs, setJobs] = useState(mockJobs);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem('jobsphere_saved_jobs');
      return saved ? JSON.parse(saved) : DEFAULT_SAVED_JOB_IDS;
    } catch {
      return DEFAULT_SAVED_JOB_IDS;
    }
  });

  const [applications, setApplications] = useState(() => {
    try {
      const apps = localStorage.getItem('jobsphere_applications');
      return apps ? JSON.parse(apps) : DEFAULT_APPLICATIONS;
    } catch {
      return DEFAULT_APPLICATIONS;
    }
  });

  // Filter state
  const [searchFilters, setSearchFilters] = useState({
    keyword: "",
    location: "",
    category: "all",
    jobTypes: [],
    experienceLevels: [],
    workplaceTypes: [],
    minSalary: 0,
    maxSalary: 250000,
    sortBy: "newest"
  });

  // ─── FETCH JOBS FROM BACKEND ─────────────────────────────────────────────
  const fetchJobsFromBackend = async () => {
    setIsLoadingJobs(true);
    try {
      const response = await jobsAPI.getAll();
      // Backend returns { success, count, jobs } — use .jobs
      const jobsList = response.data.jobs || response.data.data || [];
      if (response.data.success && jobsList.length > 0) {
        const mappedJobs = jobsList.map(mapBackendJob);
        setJobs(mappedJobs);
      }
      // If no jobs in backend yet, keep using mockJobs (fallback)
    } catch (error) {
      // Backend offline - keep using mockJobs silently
      console.warn('Backend offline, using mock data:', error.message);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // ─── FETCH APPLICATIONS FROM BACKEND ────────────────────────────────────
  const fetchApplicationsFromBackend = async () => {
    if (!isRealUser()) return;
    try {
      const response = await applicationsAPI.getMyApplications();
      if (response.data.success && response.data.data) {
        const mapped = response.data.data.map(mapBackendApplication);
        if (mapped.length > 0) {
          setApplications(mapped);
        }
      }
    } catch (error) {
      console.warn('Could not fetch applications:', error.message);
    }
  };

  // ─── FETCH SAVED JOBS FROM BACKEND ──────────────────────────────────────
  const fetchSavedJobsFromBackend = async () => {
    if (!isRealUser()) return;
    try {
      const response = await savedJobsAPI.getAll();
      if (response.data.success && response.data.data) {
        const savedIds = response.data.data.map((sj) => String(sj.job_id));
        if (savedIds.length > 0) {
          setSavedJobIds(savedIds);
        }
      }
    } catch (error) {
      console.warn('Could not fetch saved jobs:', error.message);
    }
  };

  // On mount: try to load from backend
  useEffect(() => {
    fetchJobsFromBackend();
  }, []);

  useEffect(() => {
    fetchApplicationsFromBackend();
    fetchSavedJobsFromBackend();
  }, []); // eslint-disable-line

  // Persist saved jobs to localStorage (for demo users)
  useEffect(() => {
    localStorage.setItem('jobsphere_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  // Persist applications to localStorage (for demo users)
  useEffect(() => {
    localStorage.setItem('jobsphere_applications', JSON.stringify(applications));
  }, [applications]);

  // ─── TOGGLE SAVE JOB ────────────────────────────────────────────────────
  const toggleSaveJob = async (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    const jobTitle = job ? job.title : "Job";
    const alreadySaved = savedJobIds.includes(jobId);

    // Update UI immediately (optimistic update)
    setSavedJobIds((prev) => {
      if (alreadySaved) {
        showToast(`Removed "${jobTitle}" from your saved list.`, 'info', 'Saved Job Removed');
        return prev.filter((id) => id !== jobId);
      } else {
        showToast(`Saved "${jobTitle}" to your dashboard!`, 'success', 'Job Bookmarked');
        return [...prev, jobId];
      }
    });

    // Sync with backend if real user
    if (isRealUser()) {
      try {
        if (alreadySaved) {
          await savedJobsAPI.remove(jobId);
        } else {
          await savedJobsAPI.save(jobId);
        }
      } catch (error) {
        console.warn('Could not sync saved job with backend:', error.message);
      }
    }
  };

  const isJobSaved = (jobId) => savedJobIds.includes(jobId);

  const isJobApplied = (jobId) => applications.some((app) => app.jobId === jobId || app.jobId === String(jobId));

  const getApplicationByJobId = (jobId) => applications.find((app) => app.jobId === jobId || app.jobId === String(jobId));

  // ─── APPLY FOR JOB ────────────────────────────────────────────────────────
  const applyForJob = async (jobId, formData) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return false;

    if (isJobApplied(jobId)) {
      showToast("You have already applied for this position!", "warning", "Already Applied");
      return false;
    }

    // If real user — call backend
    if (isRealUser()) {
      try {
        const response = await applicationsAPI.apply(jobId, {
          cover_letter: formData.coverLetter || '',
          resume: formData.resumeName || 'Resume.pdf',
        });

        if (response.data.success) {
          // Add to local state
          const newApp = {
            id: "app-" + Date.now(),
            jobId: String(jobId),
            jobTitle: job.title,
            company: job.company,
            companyId: job.companyId,
            companyInitials: job.companyInitials,
            companyLogoBg: job.companyLogoBg,
            location: job.location,
            salary: job.salary,
            jobType: job.jobType,
            appliedDate: new Date().toISOString().split('T')[0],
            status: "Applied",
            stageIndex: 0,
            notes: "Application successfully received by the hiring team.",
            resumeUsed: formData.resumeName || "Standard_Resume.pdf",
            coverLetterSnippet: formData.coverLetter || '',
            timeline: [{
              status: "Applied",
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              note: "Application submitted and queued for review."
            }]
          };
          setApplications((prev) => [newApp, ...prev]);
        }
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to submit application.';
        showToast(msg, 'error', 'Application Failed');
        return false;
      }
    } else {
      // Demo mode — local only
      const newApp = {
        id: "app-" + Date.now(),
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        companyId: job.companyId,
        companyInitials: job.companyInitials,
        companyLogoBg: job.companyLogoBg,
        location: job.location,
        salary: job.salary,
        jobType: job.jobType,
        appliedDate: new Date().toISOString().split('T')[0],
        status: "Applied",
        stageIndex: 0,
        notes: "Application successfully received by the hiring team.",
        resumeUsed: formData.resumeName || "Standard_Resume.pdf",
        coverLetterSnippet: formData.coverLetter || "I am enthusiastic about joining your team.",
        applicantName: formData.fullName,
        applicantEmail: formData.email,
        applicantPhone: formData.phone,
        portfolioUrl: formData.portfolioUrl,
        timeline: [{
          status: "Applied",
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          note: "Application submitted and queued for review."
        }]
      };
      setApplications((prev) => [newApp, ...prev]);
    }

    // Confetti!
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch { /* ignore */ }

    showToast(`Application for ${job.title} at ${job.company} submitted!`, 'success', 'Application Sent 🚀');
    return true;
  };

  const withdrawApplication = (appId) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    showToast("Application withdrawn successfully.", 'info', 'Application Withdrawn');
  };

  // ─── FILTER & SEARCH ─────────────────────────────────────────────────────
  const updateSearchFilters = (partial) => {
    setSearchFilters((prev) => ({ ...prev, ...partial }));
  };

  const resetSearchFilters = () => {
    setSearchFilters({
      keyword: "",
      location: "",
      category: "all",
      jobTypes: [],
      experienceLevels: [],
      workplaceTypes: [],
      minSalary: 0,
      maxSalary: 250000,
      sortBy: "newest"
    });
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (searchFilters.keyword.trim()) {
        const kw = searchFilters.keyword.toLowerCase().trim();
        const inTitle = job.title.toLowerCase().includes(kw);
        const inCompany = job.company.toLowerCase().includes(kw);
        const inSkills = (job.skills || []).some((s) => s.toLowerCase().includes(kw));
        const inDesc = (job.description || '').toLowerCase().includes(kw);
        if (!inTitle && !inCompany && !inSkills && !inDesc) return false;
      }

      if (searchFilters.location.trim()) {
        const loc = searchFilters.location.toLowerCase().trim();
        const inLocation = (job.location || '').toLowerCase().includes(loc);
        const inWorkplace = (job.workplaceType || '').toLowerCase().includes(loc);
        if (!inLocation && !inWorkplace) return false;
      }

      if (searchFilters.category && searchFilters.category !== "all") {
        if (job.category !== searchFilters.category) return false;
      }

      if (searchFilters.jobTypes.length > 0) {
        if (!searchFilters.jobTypes.includes(job.jobType)) return false;
      }

      if (searchFilters.experienceLevels.length > 0) {
        if (!searchFilters.experienceLevels.includes(job.experience)) return false;
      }

      if (searchFilters.workplaceTypes && searchFilters.workplaceTypes.length > 0) {
        if (!searchFilters.workplaceTypes.includes(job.workplaceType)) return false;
      }

      if (job.salaryMax < searchFilters.minSalary) return false;

      return true;
    }).sort((a, b) => {
      if (searchFilters.sortBy === "salary-high") return b.salaryMax - a.salaryMax;
      if (searchFilters.sortBy === "salary-low") return a.salaryMin - b.salaryMin;
      if (searchFilters.sortBy === "popular") return (b.applicantsCount || 0) - (a.applicantsCount || 0);
      return new Date(b.postedDate) - new Date(a.postedDate);
    });
  }, [jobs, searchFilters]);

  const savedJobs = useMemo(() => {
    return jobs.filter((j) => savedJobIds.includes(j.id));
  }, [jobs, savedJobIds]);

  return (
    <JobContext.Provider
      value={{
        jobs,
        filteredJobs,
        savedJobIds,
        savedJobs,
        applications,
        searchFilters,
        isLoadingJobs,
        updateSearchFilters,
        resetSearchFilters,
        toggleSaveJob,
        isJobSaved,
        applyForJob,
        isJobApplied,
        getApplicationByJobId,
        withdrawApplication,
        refetchJobs: fetchJobsFromBackend,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
