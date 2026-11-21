const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Save/Bookmark a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private (Authenticated users)
const saveJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id;

    // 1. Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job with ID ${jobId} not found.`
      });
    }

    // 2. Prevent saving the same job twice
    const existingSavedJob = await SavedJob.findByUserAndJob(userId, jobId);
    if (existingSavedJob) {
      return res.status(400).json({
        success: false,
        message: 'Job is already saved in your bookmarks.'
      });
    }

    // 3. Save job to database
    await SavedJob.create(userId, jobId);

    return res.status(201).json({
      success: true,
      message: 'Job saved successfully to your bookmarks!',
      job_id: Number(jobId)
    });
  } catch (error) {
    console.error('Save Job Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving job.',
      error: error.message
    });
  }
};

// @desc    Get all saved/bookmarked jobs for the logged-in user
// @route   GET /api/saved-jobs
// @access  Private (Authenticated users)
const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const savedJobs = await SavedJob.findByUser(userId);

    return res.status(200).json({
      success: true,
      count: savedJobs.length,
      saved_jobs: savedJobs
    });
  } catch (error) {
    console.error('Get Saved Jobs Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching saved jobs.',
      error: error.message
    });
  }
};

// @desc    Remove a saved/bookmarked job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private (Authenticated users)
const removeSavedJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id;

    // 1. Check if the saved entry exists
    const existingSavedJob = await SavedJob.findByUserAndJob(userId, jobId);
    if (!existingSavedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job record not found in your bookmarks.'
      });
    }

    // 2. Delete saved entry
    await SavedJob.delete(userId, jobId);

    return res.status(200).json({
      success: true,
      message: 'Job removed from your bookmarks successfully!'
    });
  } catch (error) {
    console.error('Remove Saved Job Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while removing saved job.',
      error: error.message
    });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  removeSavedJob
};
