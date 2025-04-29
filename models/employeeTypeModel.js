const db = require('../config/db.config');

const createEmployeeType = async (employeeType) => {
  const sql = `
    INSERT INTO employee_types (employee_type, created_at, updated_at)
    VALUES (?, ?, ?)
  `;

  const values = [employeeType.employee_type, employeeType.created_at, employeeType.updated_at];

  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
  }
};

const getEmployeeTypeById = async (employeeTypeId) => {
  const sql = `
    SELECT employee_type
    FROM employee_types
    WHERE id = ?
  `;

  const values = [employeeTypeId];

  try {
    const [rows] = await db.query(sql, values);
    if (rows.length > 0) {
      return rows[0].employee_type;
    } else {
      throw new Error('Employee type not found');
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEmployeeType,
  getEmployeeTypeById
};

