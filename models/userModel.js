const db = require('../config/db.config');

// Function to create a new user
const createUser = async (user) => {
  const sql = `INSERT INTO users (
  name, email, password, phone_number, address, userPhoto, status, employee_type, 
  created_at, updated_at, emp_id, designation, department, date_of_joining,
  uan, pf_number, esi_number, bank, acc_number, ifsc
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    user.name, user.email, user.password, user.phone_number, user.address, user.userPhotoName,
     user.status, user.employee_type, user.created_at, user.updated_at, user.emp_id,
     user.designation, user.department, user.date_of_joining, user.uan, user.pf_number,
     user.esi_number, user.bank, user.acc_number, user.ifsc
    ];
  
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

const getUserList = async (user_id) => {
  let sql = `SELECT * FROM users`;
  let values = [user_id];

  try {
    const [rows] = await db.query(sql, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

const updatePassword = async (userId, newHashedPassword) => {
  let connection;
  try {
    connection = await db.getConnection(); // Get connection from pool or single connection
    const sql = 'UPDATE users SET password = ? WHERE user_id = ?';
    const [result] = await connection.query(sql, [newHashedPassword, userId]);
    return result;
  } catch (err) {
    console.error('Error in updatePassword:', err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
}


module.exports = {
  createUser,
  findUserByEmail,
  getUserList,
  updatePassword
};
