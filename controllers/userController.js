const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require("path");

// Register
exports.registerUser = async (req, res) => {
  const { user_name, email, password, phone_number, address, status, user_type } = req.body;
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

    const user = { user_name, email, password: hashedPassword, address, phone_number, userPhotoName, status, user_type, created_at };
    const result = await User.createUser(user);

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register user', error: err.message });
  }
};
