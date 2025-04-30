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
