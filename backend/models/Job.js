const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ['internship', 'job'],
        message: 'Type must be either "internship" or "job"',
      },
      required: [true, 'Job type is required'],
    },
    category: {
      type: String,
      default: 'Software Engineering',
      trim: true,
      index: true,
    },
    required_skills: {
      type: [String],
      default: [],
    },
    min_cgpa: {
      type: Number,
      default: 0,
      min: [0, 'Minimum CGPA cannot be negative'],
      max: [10, 'Minimum CGPA cannot exceed 10'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    stipend_or_salary: {
      type: String,
      required: [true, 'Stipend or salary is required'],
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    applicants_count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for search performance
jobSchema.index({ title: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
