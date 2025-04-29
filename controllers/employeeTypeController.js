const EmployeeType = require('../models/employeeTypeModel');

exports.createEmployeeType = async (req, res) => {
  const { employee_type, created_at, updated_at } = req.body;

  if (!employee_type) {
    return res.status(400).json({ message: 'Employee type is required' });
  }

  try {
    const newEmployeeType = { 
      employee_type,
      created_at: new Date(),
      updated_at: new Date()
    };
    const result = await EmployeeType.createEmployeeType(newEmployeeType);

    res.status(201).json({
      message: 'Employee type created successfully',
      id: result.insertId,
      employee_type: newEmployeeType.employee_type,
    });
  } catch (error) {
    console.error('Error creating employee type:', error);
    res.status(500).json({
      message: 'Failed to create employee type',
      error: error.message,
    });
  }
};
