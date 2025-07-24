const express = require('express');
const router = express.Router();
const { authStudent } = require('../middleware/auth');
const {
  registerStudent,
  loginStudent,
  getStudentAttendance
} = require('../controllers/studentController');

// @route   POST /api/student/register
// @desc    Register a new student  
// @access  Public
router.post('/register', registerStudent);

// @route   POST /api/student/login
// @desc    Student login
// @access  Public
router.post('/login', loginStudent);

// @route   GET /api/student/attendance
// @desc    Get student's attendance
// @access  Private (Student only)
router.get('/attendance', authStudent, getStudentAttendance);

module.exports = router;