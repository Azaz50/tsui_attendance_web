const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require("path");
const jwt = require('jsonwebtoken');

// Register
exports.registerUser = async (req, res) => {
  const { user_name, email, password, phone_number, address, status, employee_type } = req.body;
  let { created_at } = req.body;

  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    let userPhoto = req.files?.userPhoto;
    let userPhotoName = userPhoto ? `user_${Date.now()}${path.extname(userPhoto.name)}` : null;

    if (userPhoto) {
      await userPhoto.mv(path.join(__dirname, "../uploads", userPhotoName));
  }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(String(password), saltRounds);

    if (!created_at) {
      const now = new Date();
      created_at = now.toISOString().slice(0, 19).replace('T', ' '); 
    }

    const user = { user_name, email, password: hashedPassword, address, phone_number, userPhotoName, status, employee_type, created_at };
    const result = await User.createUser(user);

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register user', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await User.findUserByEmail(email);
    if (!employee) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });
    const token = jwt.sign({ user_id: employee.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });


    // Send token and user info back
    res.status(200).json({
      message: 'Login successful',
      token,
      employee: {
        id: employee.user_id,
        name: employee.user_name,
        email: employee.email,
        phone_number: employee.phone_number,
        address: employee.address,
        status: employee.status,
        employee_type: employee.employee_type
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
