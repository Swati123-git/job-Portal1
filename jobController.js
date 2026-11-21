const Job = require('../models/Job');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Employer & Admin only)
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company_name,
      location,
      salary,
      job_type,
      skills,
      experience,
      deadline
    } = req.body;

    // 1. Validate required fields
    if (!title || !description || !company_name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, company_name, and location.'
      });
    }

    // 2. Create job tied to authenticated employer ID
    const jobId = await Job.create({
      employer_id: req.user.id,
      title,
      description,
      company_name,
      location,
      salary,
      job_type,
      skills,
      experience,
      deadline
    });

    const newJob = await Job.findById(jobId);

    return res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      job: newJob
    });
  } catch (error) {
    console.error('Create Job Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating job.',
      error: error.message
    });
  }
};

// @desc    Get all jobs (with search & filtering)
// @route   GET /api/jobs
// @access  Public (Anyone)
const getAllJobs = async (req, res) => {
  try {
    const { search, job_type, experience, location, employer_id } = req.query;

    const jobs = await Job.findAll({
      search,
      job_type,
      experience,
      location,
      employer_id
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get Jobs Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving jobs.',
      error: error.message
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public (Anyone)
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job with ID ${jobId} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Get Job By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving job details.',
      error: error.message
    });
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Employer owner only or Admin)
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const existingJob = await Job.findById(jobId);

    // 1. Check if job exists
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: `Job with ID ${jobId} not found.`
      });
    }

    // 2. Check ownership: Only the employer who created the job (or admin) can update it
    if (existingJob.employer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized. You can update only your own job postings.'
      });
    }

    // 3. Extract updated details or fallback to existing
    const updateData = {
      title: req.body.title || existingJob.title,
      description: req.body.description || existingJob.description,
      company_name: req.body.company_name || existingJob.company_name,
      location: req.body.location || existingJob.location,
      salary: req.body.salary !== undefined ? req.body.salary : existingJob.salary,
      job_type: req.body.job_type || existingJob.job_type,
      skills: req.body.skills !== undefined ? req.body.skills : existingJob.skills,
      experience: req.body.experience !== undefined ? req.body.experience : existingJob.experience,
      deadline: req.body.deadline !== undefined ? req.body.deadline : existingJob.deadline
    };

    await Job.update(jobId, updateData);
    const updatedJob = await Job.findById(jobId);

    return res.status(200).json({
      success: true,
      message: 'Job updated successfully!',
      job: updatedJob
    });
  } catch (error) {
    console.error('Update Job Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating job.',
      error: error.message
    });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Employer owner only or Admin)
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const existingJob = await Job.findById(jobId);

    // 1. Check if job exists
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: `Job with ID ${jobId} not found.`
      });
    }

    // 2. Check ownership: Only the employer who created the job (or admin) can delete it
    if (existingJob.employer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized. You can delete only your own job postings.'
      });
    }

    await Job.delete(jobId);

    return res.status(200).json({
      success: true,
      message: 'Job deleted successfully!'
    });
  } catch (error) {
    console.error('Delete Job Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting job.',
      error: error.message
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob
};
