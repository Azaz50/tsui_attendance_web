const User = require('../models/userModel');
const Employee = require('../models/employeeTypeModel');
const multer = require('multer');
const path = require("path");
const { encrypt, decrypt } = require('../utils/cryptoUtils');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { 
    name, email, password, phone_number, address, status, emp_id, designation,
    department, uan, pf_number, esi_number, bank, acc_number, ifsc
  } = req.body;

  let { created_at, updated_at, date_of_joining, employee_type } = req.body;

  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const employeeTypeData = await Employee.getEmployeeTypeByName(employee_type);
    if (!employeeTypeData) return res.status(400).json({ message: 'Invalid employee_type' });

    const employee_type_id = employeeTypeData.id;

    let userPhoto = req.files?.userPhoto;
    let userPhotoName = userPhoto ? `user_${Date.now()}${path.extname(userPhoto.name)}` : null;

    if (userPhoto) {
      await userPhoto.mv(path.join(__dirname, "../uploads", userPhotoName));
    }

    const encryptedPassword = encrypt(password);

    const now = new Date();
    if (!created_at) {
      created_at = now.toISOString().slice(0, 19).replace('T', ' ');
    }
    if (!updated_at) {
      updated_at = now.toISOString().slice(0, 19).replace('T', ' ');
    }

    const user = { 
      name, email, password: encryptedPassword, address, phone_number, userPhotoName, status, 
      employee_type: employee_type_id, created_at, updated_at,
      emp_id, designation, department, date_of_joining, uan, pf_number, esi_number, bank, acc_number, ifsc
    };

    const result = await User.createUser(user);

    res.status(201).json({ message: 'Employee registered successfully', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register employee', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await User.findUserByEmail(email);
    if (!employee) return res.status(404).json({ message: 'User not found' });

    if (employee.status !== '1' && employee.status !== 1) {
      return res.status(403).json({ message: 'You are not allowed to login. Inactive user.' });
    }

    const decryptedPassword = decrypt(employee.password);
    if (decryptedPassword !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const employeeType = await Employee.getEmployeeTypeById(employee.employee_type);
    
    const token = jwt.sign({ 
      user_id: employee.user_id,
      employee_type: employee.employee_type
     }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const baseUrl = `${req.protocol}://${req.get('host')}/api/uploads/`;

    res.status(200).json({
      message: 'Login successful',
      token,
      employee: {
        id: employee.user_id,
        name: employee.name,
        email: employee.email,
        phone_number: employee.phone_number,
        address: employee.address,
        status: employee.status,
        employee_type: employeeType,
        userPhoto: employee.userPhoto ? baseUrl + employee.userPhoto : null,
        emp_id: employee.emp_id,
        designation: employee.designation,
        department: employee.department,
        date_of_joining: employee.date_of_joining,
        uan: employee.uan,
        pf_number: employee.pf_number,
        esi_number: employee.esi_number,
        bank: employee.bank,
        acc_number: employee.acc_number,
        ifsc: employee.ifsc
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.getUserList = async (req, res) => {
  try {
    const users = await User.getUserList();
    const baseUrl = `${req.protocol}://${req.get('host')}/api/uploads/`;

    const updatedUsers = users.map(user => {
      let decryptedPassword = null;

      try {
        // Decrypt password if exists
        decryptedPassword = user.password ? decrypt(user.password) : null;
      } catch (err) {
        console.error(`Failed to decrypt password for user ID ${user.user_id}:`, err.message);
      }

      return {
        ...user,
        password: decryptedPassword,
        userPhoto: user.userPhoto ? baseUrl + user.userPhoto : null
      };
    });

    res.status(200).json({
      message: 'User list fetched successfully',
      users: updatedUsers
    });
  } catch (error) {
    console.error('Error fetching user list:', error);
    res.status(500).json({
      message: 'Failed to fetch user list',
      error: error.message
    });
  }
};
