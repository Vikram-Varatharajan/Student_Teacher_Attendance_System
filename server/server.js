const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Teacher-Student Attendance System API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});