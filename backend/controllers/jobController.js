const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Create a new Job / Internship
// @route   POST /api/jobs
// @access  Private (Company only)
const createJob = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      required_skills,
      min_cgpa,
      location,
      stipend_or_salary,
      deadline,
    } = req.body;

    if (!title || !type || !location || !stipend_or_salary || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, type, location, stipend_or_salary, and deadline',
      });
    }

    const skillsArray = Array.isArray(required_skills)
      ? required_skills
      : typeof required_skills === 'string'
      ? required_skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const job = await Job.create({
      company_id: req.user.id,
      title: title.trim(),
      type,
      category: category ? category.trim() : 'Software Engineering',
      required_skills: skillsArray,
      min_cgpa: min_cgpa !== undefined ? Number(min_cgpa) : 0,
      location: location.trim(),
      stipend_or_salary: stipend_or_salary.trim(),
      deadline: new Date(deadline),
      status: 'open',
      applicants_count: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error creating job: ' + err.message,
    });
  }
};

// @desc    Get jobs with combined search & filtering
// @route   GET /api/jobs
// @access  Public / Private
// @operators Demonstrated: $and, $or, $in, $regex, $lte, $gte
const getJobs = async (req, res) => {
  try {
    const { keyword, skills, cgpa, location, type, category, status } = req.query;

    const andConditions = [];

    // 1. Status filter (default to open jobs, or allow explicit status)
    if (status) {
      andConditions.push({ status });
    } else {
      andConditions.push({ status: 'open' });
    }

    // Category filter
    if (category && category.trim() !== '') {
      andConditions.push({
        category: { $regex: new RegExp(`^${category.trim()}$`, 'i') },
      });
    }

    // 2. Keyword search on title using $regex with case-insensitive option
    if (keyword && keyword.trim() !== '') {
      andConditions.push({
        title: { $regex: keyword.trim(), $options: 'i' },
      });
    }

    // 3. Skills matching via array intersection using $in operator
    if (skills && skills.trim() !== '') {
      const skillsArray = skills
        .split(',')
        .map((s) => new RegExp(`^${s.trim()}$`, 'i')); // or exact strings via $in
      // If student specifies skills (e.g. "React, Node"), find jobs requiring any of those skills
      const rawSkillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);
      andConditions.push({
        required_skills: { $in: rawSkillsList.map((s) => new RegExp(s, 'i')) },
      });
    }

    // 4. CGPA eligibility using $lte operator (job's min_cgpa must be <= student's cgpa)
    if (cgpa !== undefined && cgpa !== '') {
      const studentCgpa = Number(cgpa);
      if (!isNaN(studentCgpa)) {
        andConditions.push({
          min_cgpa: { $lte: studentCgpa },
        });
      }
    }

    // 5. Job type filter (internship | job)
    if (type && (type === 'internship' || type === 'job')) {
      andConditions.push({ type });
    }

    // 6. Location combined with Remote using $or operator
    if (location && location.trim() !== '') {
      const loc = location.trim();
      andConditions.push({
        $or: [
          { location: { $regex: loc, $options: 'i' } },
          { location: { $regex: 'remote', $options: 'i' } },
        ],
      });
    }

    // Combine all filters using $and operator
    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    const jobs = await Job.find(query)
      .populate('company_id', 'name email website description')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs: ' + err.message,
    });
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public / Private
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'company_id',
      'name email website description'
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.json({
      success: true,
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job details: ' + err.message,
    });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Company owner only)
// @operator $set
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Verify company ownership
    if (job.company_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    const {
      title,
      type,
      category,
      required_skills,
      min_cgpa,
      location,
      stipend_or_salary,
      deadline,
      status,
    } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (type !== undefined) updateFields.type = type;
    if (category !== undefined) updateFields.category = category.trim();
    if (min_cgpa !== undefined) updateFields.min_cgpa = Number(min_cgpa);
    if (location !== undefined) updateFields.location = location.trim();
    if (stipend_or_salary !== undefined) updateFields.stipend_or_salary = stipend_or_salary.trim();
    if (deadline !== undefined) updateFields.deadline = new Date(deadline);
    if (status !== undefined) updateFields.status = status;
    if (required_skills !== undefined) {
      updateFields.required_skills = Array.isArray(required_skills)
        ? required_skills
        : typeof required_skills === 'string'
        ? required_skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    }

    // Demonstrated MongoDB Operator: $set
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('company_id', 'name email website description');

    res.json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating job: ' + err.message,
    });
  }
};

// @desc    Delete a job and its applications
// @route   DELETE /api/jobs/:id
// @access  Private (Company owner only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.company_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    await Application.deleteMany({ job_id: job._id });
    await Job.findByIdAndDelete(job._id);

    res.json({
      success: true,
      message: 'Job and associated applications deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error deleting job: ' + err.message,
    });
  }
};

// @desc    Get jobs posted by current logged in company
// @route   GET /api/jobs/company/my-jobs
// @access  Private (Company only)
const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company_id: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching company jobs: ' + err.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getCompanyJobs,
};
