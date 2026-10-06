const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Company = require('../models/Company');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'supersecret_jwt_key_for_placement_portal_2026'
    );

    if (decoded.role === 'student') {
      const student = await Student.findById(decoded.id).select('-password_hash');
      if (!student) {
        return res.status(401).json({
          success: false,
          message: 'Student account not found',
        });
      }
      req.user = {
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        role: 'student',
        student,
      };
    } else if (decoded.role === 'company') {
      const company = await Company.findById(decoded.id).select('-password_hash');
      if (!company) {
        return res.status(401).json({
          success: false,
          message: 'Company account not found',
        });
      }
      req.user = {
        id: company._id.toString(),
        name: company.name,
        email: company.email,
        role: 'company',
        company,
      };
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid token role',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token validation failed: ' + err.message,
    });
  }
};

const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Student role required',
    });
  }
};

const isCompany = (req, res, next) => {
  if (req.user && req.user.role === 'company') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Company role required',
    });
  }
};

module.exports = { protect, isStudent, isCompany };
