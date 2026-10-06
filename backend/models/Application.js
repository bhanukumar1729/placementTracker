const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID reference is required'],
      index: true,
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID reference is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
        message: '{VALUE} is not a valid application status',
      },
      default: 'Applied',
    },
    applied_on: {
      type: Date,
      default: Date.now,
    },
    updated_on: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce one application per student per job (prevent duplicates at DB level)
applicationSchema.index({ student_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
