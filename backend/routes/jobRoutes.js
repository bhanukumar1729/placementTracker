const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getCompanyJobs,
} = require('../controllers/jobController');
const { protect, isCompany } = require('../middleware/authMiddleware');

// Specific routes before param routes
router.get('/company/my-jobs', protect, isCompany, getCompanyJobs);

// Public / general routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected company routes
router.post('/', protect, isCompany, createJob);
router.put('/:id', protect, isCompany, updateJob);
router.delete('/:id', protect, isCompany, deleteJob);

module.exports = router;
