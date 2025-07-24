const express = require('express');
const router = express.Router();
const { authTeacher } = require('../middleware/auth');
const {
  registerTeacher,
  loginTeacher,
  getStudents,
  markAttendance,
  getAttendanceHistory
} = require('../controllers/teacherController');

// @route   POST /api/teacher/register
// @desc    Register a new teacher
// @access  Public
router.post('/register', registerTeacher);

// @route   POST /api/teacher/login
// @desc    Teacher login
// @access  Public
router.post('/login', loginTeacher);

// @route   GET /api/teacher/students
// @desc    Get all students
// @access  Private (Teacher only)
router.get('/students', authTeacher, getStudents);

// @route   POST /api/teacher/mark-attendance
// @desc    Mark attendance for a student
// @access  Private (Teacher only)
router.post('/mark-attendance', authTeacher, markAttendance);

// @route   GET /api/teacher/attendance-history
// @desc    Get attendance history
// @access  Private (Teacher only)
router.get('/attendance-history', authTeacher, getAttendanceHistory);

module.exports = router;