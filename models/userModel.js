const db = require('../config/db.config');

// Function to create a new user
const createUser = async (user) => {
  const sql = `INSERT INTO users ( user_name, email, password, phone_number, address, userPhoto, status, employee_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [user.user_name, user.email, user.password, user.phone_number, user.address, user.userPhotoName, user.status, user.employee_type, user.created_at];
  
  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
  }
};

const findUserByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  const [rows] = await db.query(sql, [email]);
  return rows[0];
};


module.exports = {
  createUser,
  findUserByEmail
};
