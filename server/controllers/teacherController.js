const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { JWT_SECRET } = require('../middleware/auth');

// Teacher Registration
const registerTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher with this email already exists' });
    }

    // Create new teacher
    const teacher = new Teacher({
      name,
      email,
      password
    });

    await teacher.save();

    // Generate JWT token
    const token = jwt.sign({ id: teacher._id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Teacher registered successfully',
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher Login
const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if teacher exists
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: teacher._id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).select('-password');
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { studentId, status, date } = req.body;
    const teacherId = req.teacher._id;

    // Parse date or use today
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0); // Set to start of day

    // Check if attendance already exists for this student on this date
    const existingAttendance = await Attendance.findOne({
      studentId,
      date: attendanceDate
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.teacherId = teacherId;
      await existingAttendance.save();
      
      const updatedAttendance = await Attendance.findById(existingAttendance._id)
        .populate('studentId', 'name email class');
      
      res.json(updatedAttendance);
    } else {
      // Create new attendance record
      const attendance = new Attendance({
        studentId,
        teacherId,
        date: attendanceDate,
        status
      });

      await attendance.save();
      
      const newAttendance = await Attendance.findById(attendance._id)
        .populate('studentId', 'name email class');
      
      res.json(newAttendance);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get attendance history
const getAttendanceHistory = async (req, res) => {
  try {
    const { date, studentId } = req.query;
    
    let query = {};
    
    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      query.date = queryDate;
    }
    
    if (studentId) {
      query.studentId = studentId;
    }

    const attendance = await Attendance.find(query)
      .populate('studentId', 'name email class')
      .populate('teacherId', 'name email')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerTeacher,
  loginTeacher,
  getStudents,
  markAttendance,
  getAttendanceHistory
};