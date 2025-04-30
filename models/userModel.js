const db = require('../config/db.config');

// Function to create a new user
const createUser = async (user) => {
  const sql = `INSERT INTO users ( 
  name, email, password, phone_number, address, userPhoto, status, employee_type, 
  created_at, updated_at, emp_id, emp_name, designation, department, date_of_joining,
  uan, pf_number, esi_number, bank, acc_number, ifsc
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    user.name, user.email, user.password, user.phone_number, user.address, user.userPhotoName,
     user.status, user.employee_type, user.created_at, user.updated_at, user.emp_id, user.emp_name,
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


module.exports = {
  createUser,
  findUserByEmail,
  getUserList
};
