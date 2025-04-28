const db = require('../config/db.config');  // Assuming db is the MySQL connection

// Function to create a new EmployeeType
const createEmployeeType = async (employeeType) => {
  const sql = `
    INSERT INTO employee_types (employee_type, user_id)
    VALUES (?, ?)
  `;

  const values = [employeeType.employee_type, employeeType.user_id];

  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEmployeeType,
};
