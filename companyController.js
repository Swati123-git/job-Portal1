const Company = require('../models/Company');

// @desc    Create a new company profile
// @route   POST /api/companies
// @access  Private (Employer & Admin only)
const createCompany = async (req, res) => {
  try {
    const { company_name, description, website, location, logo } = req.body;
    const employer_id = req.user.id;

    // 1. Validate required fields
    if (!company_name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide company_name.'
      });
    }

    // 2. Check duplicate company name for same employer
    const existingCompany = await Company.findByEmployerAndName(employer_id, company_name);
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: `You have already registered a company profile named '${company_name}'.`
      });
    }

    // 3. Create company profile
    const companyId = await Company.create({
      employer_id,
      company_name,
      description,
      website,
      location,
      logo
    });

    const newCompany = await Company.findById(companyId);

    return res.status(201).json({
      success: true,
      message: 'Company profile created successfully!',
      company: newCompany
    });
  } catch (error) {
    console.error('Create Company Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating company profile.',
      error: error.message
    });
  }
};

// @desc    Get all company profiles (with optional search)
// @route   GET /api/companies
// @access  Public (Anyone)
const getAllCompanies = async (req, res) => {
  try {
    const { search } = req.query;
    const companies = await Company.findAll(search);

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies
    });
  } catch (error) {
    console.error('Get All Companies Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving companies.',
      error: error.message
    });
  }
};

// @desc    Get single company profile by ID
// @route   GET /api/companies/:id
// @access  Public (Anyone)
const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: `Company profile with ID ${companyId} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      company
    });
  } catch (error) {
    console.error('Get Company By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving company profile.',
      error: error.message
    });
  }
};

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private (Employer owner only or Admin)
const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const existingCompany = await Company.findById(companyId);

    // 1. Check if company exists
    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: `Company profile with ID ${companyId} not found.`
      });
    }

    // 2. Ownership check: Only owner employer or Admin can update
    if (existingCompany.employer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized. You can update only your own company profile.'
      });
    }

    const updateData = {
      company_name: req.body.company_name || existingCompany.company_name,
      description: req.body.description !== undefined ? req.body.description : existingCompany.description,
      website: req.body.website !== undefined ? req.body.website : existingCompany.website,
      location: req.body.location !== undefined ? req.body.location : existingCompany.location,
      logo: req.body.logo !== undefined ? req.body.logo : existingCompany.logo
    };

    await Company.update(companyId, updateData);
    const updatedCompany = await Company.findById(companyId);

    return res.status(200).json({
      success: true,
      message: 'Company profile updated successfully!',
      company: updatedCompany
    });
  } catch (error) {
    console.error('Update Company Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating company profile.',
      error: error.message
    });
  }
};

// @desc    Delete company profile
// @route   DELETE /api/companies/:id
// @access  Private (Employer owner only or Admin)
const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const existingCompany = await Company.findById(companyId);

    // 1. Check if company exists
    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: `Company profile with ID ${companyId} not found.`
      });
    }

    // 2. Ownership check: Only owner employer or Admin can delete
    if (existingCompany.employer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized. You can delete only your own company profile.'
      });
    }

    await Company.delete(companyId);

    return res.status(200).json({
      success: true,
      message: 'Company profile deleted successfully!'
    });
  } catch (error) {
    console.error('Delete Company Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting company profile.',
      error: error.message
    });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
};
