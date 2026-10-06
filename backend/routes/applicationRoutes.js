const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getStudentApplications,
  getJobApplicants,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect, isStudent, isCompany } = require('../middleware/authMiddleware');

// Student routes
router.post('/', protect, isStudent, applyToJob);
router.get('/my-applications', protect, isStudent, getStudentApplications);
router.delete('/:id', protect, isStudent, withdrawApplication);

// Company routes
router.get('/job/:jobId', protect, isCompany, getJobApplicants);
router.put('/:id/status', protect, isCompany, updateApplicationStatus);

module.exports = router;
