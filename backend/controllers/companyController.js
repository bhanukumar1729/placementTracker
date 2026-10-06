const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Get company analytics via MongoDB Aggregation Pipeline
// @route   GET /api/company/analytics
// @access  Private (Company only)
// @operators Demonstrated in Aggregation Pipeline: $match, $lookup, $unwind, $group, $sum, $avg, $project, $sort
const getCompanyAnalytics = async (req, res) => {
  try {
    const companyObjectId = new mongoose.Types.ObjectId(req.user.id);

    // Find all job IDs belonging to this company
    const companyJobs = await Job.find({ company_id: companyObjectId });
    const jobIds = companyJobs.map((j) => j._id);

    if (jobIds.length === 0) {
      return res.json({
        success: true,
        summary: {
          totalJobs: 0,
          totalApplications: 0,
          overallAvgCgpa: 0,
          statusBreakdown: {},
        },
        jobAnalytics: [],
      });
    }

    // Pipeline 1: Group applications by job and status, compute count ($sum) and average CGPA ($avg)
    const jobStatusPipeline = [
      // 1. $match: filter applications for jobs belonging to this company
      {
        $match: {
          job_id: { $in: jobIds },
        },
      },
      // 2. $lookup: join with students collection to inspect student CGPA
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'studentDetails',
        },
      },
      // 3. $unwind: deconstruct studentDetails array
      {
        $unwind: '$studentDetails',
      },
      // 4. $lookup: join with jobs collection for job title and type
      {
        $lookup: {
          from: 'jobs',
          localField: 'job_id',
          foreignField: '_id',
          as: 'jobDetails',
        },
      },
      {
        $unwind: '$jobDetails',
      },
      // 5. $group: group by Job and Status, aggregate count with $sum and CGPA with $avg
      {
        $group: {
          _id: {
            jobId: '$job_id',
            status: '$status',
          },
          jobTitle: { $first: '$jobDetails.title' },
          jobType: { $first: '$jobDetails.type' },
          applicantsCount: { $sum: 1 },
          avgCgpa: { $avg: '$studentDetails.cgpa' },
        },
      },
      // 6. $project: format output neatly
      {
        $project: {
          _id: 0,
          jobId: '$_id.jobId',
          status: '$_id.status',
          jobTitle: 1,
          jobType: 1,
          count: '$applicantsCount',
          avgCgpa: { $round: ['$avgCgpa', 2] },
        },
      },
      // 7. $sort: order by job title and status
      {
        $sort: { jobTitle: 1, status: 1 },
      },
    ];

    const jobAnalytics = await Application.aggregate(jobStatusPipeline);

    // Pipeline 2: Company-wide overall metrics
    const companySummaryPipeline = [
      {
        $match: {
          job_id: { $in: jobIds },
        },
      },
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'studentDetails',
        },
      },
      {
        $unwind: '$studentDetails',
      },
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          overallAvgCgpa: { $avg: '$studentDetails.cgpa' },
        },
      },
      {
        $project: {
          _id: 0,
          totalApplications: 1,
          overallAvgCgpa: { $round: ['$overallAvgCgpa', 2] },
        },
      },
    ];

    const overallMetrics = await Application.aggregate(companySummaryPipeline);

    // Pipeline 3: Company-wide status counts
    const statusCountsPipeline = [
      {
        $match: {
          job_id: { $in: jobIds },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ];

    const statusCounts = await Application.aggregate(statusCountsPipeline);
    const statusBreakdown = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Pipeline 4: Per-job comprehensive metrics (average CGPA across all applicants for each job)
    const perJobPipeline = [
      {
        $match: {
          job_id: { $in: jobIds },
        },
      },
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'studentDetails',
        },
      },
      {
        $unwind: '$studentDetails',
      },
      {
        $lookup: {
          from: 'jobs',
          localField: 'job_id',
          foreignField: '_id',
          as: 'jobDetails',
        },
      },
      {
        $unwind: '$jobDetails',
      },
      {
        $group: {
          _id: '$job_id',
          jobTitle: { $first: '$jobDetails.title' },
          jobType: { $first: '$jobDetails.type' },
          totalApplicants: { $sum: 1 },
          avgCgpa: { $avg: '$studentDetails.cgpa' },
        },
      },
      {
        $project: {
          jobId: '$_id',
          jobTitle: 1,
          jobType: 1,
          totalApplicants: 1,
          avgCgpa: { $round: ['$avgCgpa', 2] },
          _id: 0,
        },
      },
    ];

    const perJobStats = await Application.aggregate(perJobPipeline);

    res.json({
      success: true,
      summary: {
        totalJobs: companyJobs.length,
        totalApplications: overallMetrics.length > 0 ? overallMetrics[0].totalApplications : 0,
        overallAvgCgpa: overallMetrics.length > 0 ? overallMetrics[0].overallAvgCgpa : 0,
        statusBreakdown,
      },
      perJobStats,
      jobStatusBreakdown: jobAnalytics,
      pipelineExplanation: {
        operatorsUsed: ['$match', '$lookup', '$unwind', '$group', '$sum', '$avg', '$project', '$sort'],
        description: 'Groups applications by job & status, calculates counts with $sum, and computes applicant average CGPA with $avg.',
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error computing company analytics: ' + err.message,
    });
  }
};

module.exports = {
  getCompanyAnalytics,
};
