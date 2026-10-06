const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Student only)
// @operator Demonstrated: $inc (increments applicants_count on Job)
const applyToJob = async (req, res) => {
  try {
    const { job_id } = req.body;

    if (!job_id) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required',
      });
    }

    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Applications for this job are closed',
      });
    }

    // Check if student already applied (prevent duplicate applications)
    const existingApplication = await Application.findOne({
      student_id: req.user.id,
      job_id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
        existingApplicationId: existingApplication._id,
      });
    }

    // Create the application
    const application = await Application.create({
      student_id: req.user.id,
      job_id,
      status: 'Applied',
      applied_on: new Date(),
      updated_on: new Date(),
    });

    // Demonstrated MongoDB Operator: $inc
    // Atomically increment the applicants_count counter on the Job document
    await Job.findByIdAndUpdate(
      job_id,
      { $inc: { applicants_count: 1 } },
      { new: true }
    );

    const populatedApp = await Application.findById(application._id)
      .populate('job_id', 'title type location stipend_or_salary company_id')
      .populate('student_id', 'name email branch cgpa');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: populatedApp,
    });
  } catch (err) {
    // MongoDB duplicate key error (code 11000) safety net
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job (duplicate prevented)',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting application: ' + err.message,
    });
  }
};

// @desc    Get all applications submitted by current logged-in student
// @route   GET /api/applications/my-applications
// @access  Private (Student only)
const getStudentApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student_id: req.user.id })
      .populate({
        path: 'job_id',
        populate: {
          path: 'company_id',
          select: 'name email website',
        },
      })
      .sort({ applied_on: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications: ' + err.message,
    });
  }
};

// @desc    Get all applicants for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Company only)
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Verify company ownership of the job
    if (job.company_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applicants for this job',
      });
    }

    const applications = await Application.find({ job_id: req.params.jobId })
      .populate('student_id', 'name email branch cgpa skills resume_url')
      .sort({ applied_on: -1 });

    res.json({
      success: true,
      jobTitle: job.title,
      count: applications.length,
      applications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job applicants: ' + err.message,
    });
  }
};

// @desc    Update applicant status
// @route   PUT /api/applications/:id/status
// @access  Private (Company only)
// @operator Demonstrated: $set
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id).populate('job_id');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check that job belongs to current company
    if (application.job_id.company_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update applicants for this job',
      });
    }

    // Demonstrated MongoDB Operator: $set
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status,
          updated_on: new Date(),
        },
      },
      { new: true }
    )
      .populate('student_id', 'name email branch cgpa skills resume_url')
      .populate('job_id', 'title company_id');

    res.json({
      success: true,
      message: `Applicant status successfully updated to "${status}"`,
      application: updatedApplication,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating application status: ' + err.message,
    });
  }
};

// @desc    Withdraw / delete application
// @route   DELETE /api/applications/:id
// @access  Private (Student only)
// @operator Demonstrated: $inc (decrements applicants_count)
const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.student_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application',
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    // Atomically decrement applicant count on Job
    await Job.findByIdAndUpdate(
      application.job_id,
      { $inc: { applicants_count: -1 } }
    );

    res.json({
      success: true,
      message: 'Application withdrawn successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error withdrawing application: ' + err.message,
    });
  }
};

module.exports = {
  applyToJob,
  getStudentApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
};
