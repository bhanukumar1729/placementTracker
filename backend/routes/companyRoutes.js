const express = require('express');
const router = express.Router();
const { getCompanyAnalytics } = require('../controllers/companyController');
const { protect, isCompany } = require('../middleware/authMiddleware');

// Aggregation pipeline analytics route
router.get('/analytics', protect, isCompany, getCompanyAnalytics);

module.exports = router;
