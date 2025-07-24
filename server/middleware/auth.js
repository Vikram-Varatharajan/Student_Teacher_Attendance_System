const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const JWT_SECRET = 'your_jwt_secret_key_here';

const authTeacher = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const teacher = await Teacher.findById(decoded.id).select('-password');
    
    if (!teacher) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.teacher = teacher;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const authStudent = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const student = await Student.findById(decoded.id).select('-password');
    
    if (!student) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.student = student;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { authTeacher, authStudent, JWT_SECRET };