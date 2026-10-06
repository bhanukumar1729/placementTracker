const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Company = require('../models/Company');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecret_jwt_key_for_placement_portal_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/student/register
// @access  Public
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, skills, branch, cgpa, resume_url } = req.body;

    if (!name || !email || !password || !branch || cgpa === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, branch, cgpa',
      });
    }

    const existingStudent = await Student.findOne({ email: email.toLowerCase().trim() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Parse skills if string
    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const student = await Student.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash,
      skills: parsedSkills,
      branch: branch.trim(),
      cgpa: Number(cgpa),
      resume_url: resume_url ? resume_url.trim() : '',
    });

    const token = generateToken(student._id, 'student');

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
        branch: student.branch,
        cgpa: student.cgpa,
        skills: student.skills,
        resume_url: student.resume_url,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error registering student: ' + err.message,
    });
  }
};

// @desc    Authenticate student & get token
// @route   POST /api/auth/student/login
// @access  Public
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const student = await Student.findOne({ email: email.toLowerCase().trim() });
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, student.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(student._id, 'student');

    res.json({
      success: true,
      message: 'Student logged in successfully',
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
        branch: student.branch,
        cgpa: student.cgpa,
        skills: student.skills,
        resume_url: student.resume_url,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error logging in student: ' + err.message,
    });
  }
};

// @desc    Register a new company
// @route   POST /api/auth/company/register
// @access  Public
const registerCompany = async (req, res) => {
  try {
    const { name, email, password, description, website } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password',
      });
    }

    const existingCompany = await Company.findOne({ email: email.toLowerCase().trim() });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'A company account with this email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const company = await Company.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash,
      description: description ? description.trim() : '',
      website: website ? website.trim() : '',
    });

    const token = generateToken(company._id, 'company');

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      token,
      user: {
        id: company._id,
        name: company.name,
        email: company.email,
        role: 'company',
        description: company.description,
        website: company.website,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error registering company: ' + err.message,
    });
  }
};

// @desc    Authenticate company & get token
// @route   POST /api/auth/company/login
// @access  Public
const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const company = await Company.findOne({ email: email.toLowerCase().trim() });
    if (!company) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, company.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(company._id, 'company');

    res.json({
      success: true,
      message: 'Company logged in successfully',
      token,
      user: {
        id: company._id,
        name: company.name,
        email: company.email,
        role: 'company',
        description: company.description,
        website: company.website,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error logging in company: ' + err.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const student = await Student.findById(req.user.id).select('-password_hash');
      return res.json({
        success: true,
        user: {
          ...student.toObject(),
          role: 'student',
        },
      });
    } else {
      const company = await Company.findById(req.user.id).select('-password_hash');
      return res.json({
        success: true,
        user: {
          ...company.toObject(),
          role: 'company',
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile: ' + err.message,
    });
  }
};

// @desc    Update student profile using $set operator
// @route   PUT /api/auth/student/profile
// @access  Private (Student only)
// @operator $set
const updateStudentProfile = async (req, res) => {
  try {
    const { name, branch, cgpa, skills, resume_url } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (branch !== undefined) updateFields.branch = branch.trim();
    if (cgpa !== undefined) updateFields.cgpa = Number(cgpa);
    if (skills !== undefined) {
      updateFields.skills = Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
    }
    if (resume_url !== undefined) updateFields.resume_url = resume_url.trim();

    // Demonstrated MongoDB Operator: $set
    const updatedStudent = await Student.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password_hash');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      student: updatedStudent,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile: ' + err.message,
    });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  registerCompany,
  loginCompany,
  getMe,
  updateStudentProfile,
};
