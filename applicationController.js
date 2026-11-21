const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Job Seeker only)
const applyForJob = async (req, res) => {
  try {
    const { job_id, resume, cover_letter } = req.body;
    const applicant_id = req.user.id;

    // 1. Validate required fields
    if (!job_id || !resume) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job_id and resume.'
      });
    }

    // 2. Check if job exists
    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job with ID ${job_id} not found.`
      });
    }

    // 3. Prevent duplicate applications (a user cannot apply twice to the same job)
    const existingApp = await Application.findByApplicantAndJob(applicant_id, job_id);
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job.'
      });
    }

    // 4. Create new application record
    const applicationId = await Application.create({
      job_id,
      applicant_id,
      resume,
      cover_letter
    });

    const newApplication = await Application.findById(applicationId);

    return res.status(201).json({
      success: true,
      message: 'Job application submitted successfully!',
      application: newApplication
    });
  } catch (error) {
    console.error('Apply Job Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while applying for job.',
      error: error.message
    });
  }
};

// @desc    Get current user's submitted applications
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker / Authenticated user)
const getMyApplications = async (req, res) => {
  try {
    const applicant_id = req.user.id;
    const applications = await Application.findByApplicant(applicant_id);

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get My Applications Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching your applications.',
      error: error.message
    });
  }
};

// @desc    Get all applications for a specific job (Employer view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer owner of job or Admin)
const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // 1. Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job with ID ${jobId} not found.`
      });
    }

    // 2. Authorization check: Only employer who posted the job or Admin can view applications
    if (job.employer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized. You can view applications only for your own job postings.'
      });
    }

    // 3. Fetch applications for the job
    const applications = await Application.findByJob(jobId);

    return res.status(200).json({
      success: true,
      job_title: job.title,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get Job Applications Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching job applications.',
      error: error.message
    });
  }
};

// @desc    Update application status (Applied -> Shortlisted -> Rejected -> Selected)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer owner of job or Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    // 1. Valid status options validation
    const validStatuses = ['Applied', 'Shortlisted', 'Rejected', 'Selected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid options are: ${validStatuses.join(', ')}`
      });
    }

    // 2. Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${applicationId} not found.`
      });
    }

    // 3. Authorization check: Only employer who owns the job can change candidate status
    if (application.employer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized. You can update applications only for your own posted jobs.'
      });
    }

    // 4. Update status in database
    await Application.updateStatus(applicationId, status);
    const updatedApplication = await Application.findById(applicationId);

    return res.status(200).json({
      success: true,
      message: `Application status updated to '${status}' successfully!`,
      application: updatedApplication
    });
  } catch (error) {
    console.error('Update Application Status Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating application status.',
      error: error.message
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
};
