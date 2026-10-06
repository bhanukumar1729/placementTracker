const express = require('express');
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  registerCompany,
  loginCompany,
  getMe,
  updateStudentProfile,
} = require('../controllers/authController');
const { protect, isStudent } = require('../middleware/authMiddleware');

// Student Auth Routes
router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);
router.put('/student/profile', protect, isStudent, updateStudentProfile);

// Company Auth Routes
router.post('/company/register', registerCompany);
router.post('/company/login', loginCompany);

// Shared Me Route
router.get('/me', protect, getMe);

module.exports = router;
