const path = require('path');
const fs = require('fs');
const Salary = require('../models/salaryModel');

// Create Salary
exports.createSalary = async (req, res) => {
  try {
    const result = await Salary.createSalary(req.body);
    res.status(201).json({ message: 'Salary record created', id: result.insertId });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ message: 'Failed to create salary', error: error.message });
  }
};

exports.updateSalary = async (req, res) => {
  const { salary_id } = req.params;
  const forbiddenFields = ['user_id', 'month', 'year'];

  // Check if forbidden fields are present in the request body
  const attemptedFields = Object.keys(req.body);
  const invalidFields = attemptedFields.filter(field => forbiddenFields.includes(field));

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: `You are not allowed to update the following fields: ${invalidFields.join(', ')}`
    });
  }

  try {
    await Salary.updateSalary(salary_id, req.body);
    res.status(200).json({ message: 'Salary record updated' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Failed to update salary', error: error.message });
  }
};


// List Salaries
exports.listSalaries = async (req, res) => {
  try {
    const salaries = await Salary.listSalaries();
    res.status(200).json(salaries);
  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ message: 'Failed to fetch salaries', error: error.message });
  }
};


exports.createSalarySlip = async (req, res) => {
  try {
    const { user_id, month } = req.body;
    const uploadedFile = req.files?.excel_file;

    if (!user_id || !month || !uploadedFile) {
      return res.status(400).json({ message: 'User ID, month, and Excel file are required' });
    }

    const allowedTypes = ['.xls', '.xlsx'];
    const fileExt = path.extname(uploadedFile.name).toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      return res.status(400).json({ message: 'Only Excel files are allowed' });
    }

    // Save the file
    const fileName = `salary_${user_id}_${month}_${Date.now()}${path.extname(uploadedFile.name)}`;
    const uploadPath = path.join(__dirname, '../excelFile', fileName);
    await uploadedFile.mv(uploadPath);

    const salarySlip = {
      user_id,
      month,
      excel_file: fileName
    };

    const result = await Salary.createSalarySlip(salarySlip);

    res.status(201).json({
      message: 'Salary slip created successfully',
      salarySlipId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating salary slip', error: error.message });
  }
};

exports.getSalarySlips = async (req, res) => {
  try {
    const { user_id, month } = req.query;

    if (!user_id || !month) {
      return res.status(400).json({ message: 'User ID and month are required' });
    }

    const slips = await Salary.getSalarySlipsByUserAndMonth(user_id, month);

    const baseUrl = `${req.protocol}://${req.get('host')}/api/excelFile/`;

    const formattedSlips = slips.map(slip => ({
      salary_id: slip.salary_id,
      user_id: slip.user_id,
      month: slip.month,
      excel_file: slip.excel_file ? baseUrl + slip.excel_file : null
    }));

    res.json(formattedSlips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching salary slips', error: error.message });
  }
};


exports.getSalaryMonthsByUser = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const months = await Salary.getSalaryMonthsByUser(user_id);

    res.status(200).json(months);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching months', error: error.message });
  }
};