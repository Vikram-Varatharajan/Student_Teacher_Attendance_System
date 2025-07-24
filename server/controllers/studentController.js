const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { JWT_SECRET } = require('../middleware/auth');

// Student Registration
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, class: studentClass } = req.body;

    // Validation
    if (!name || !email || !password || !studentClass) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Create new student
    const student = new Student({
      name,
      email,
      password,
      class: studentClass
    });

    await student.save();

    // Generate JWT token
    const token = jwt.sign({ id: student._id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        class: student.class
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student Login
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: student._id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        class: student.class
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's attendance
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.student._id;
    
    const attendance = await Attendance.find({ studentId })
      .populate('teacherId', 'name email')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getStudentAttendance
};