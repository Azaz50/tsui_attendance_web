const db = require('../config/db.config');

// Function to create a new shop
const createShop = async (shop) => {
  const sql = `INSERT INTO shops ( shop_name, shop_address, shop_owner_name, shop_phone_number, shop_location, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [shop.shop_name, shop.shop_address, shop.shop_owner_name, shop.shop_phone_number, shop.shop_location, shop.user_id, shop.created_at, shop.updated_at];
  
  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
    console.log(error);
  }
};


const getShopsByRole = async (user_id, employee_type, search = '', limit = 10, offset = 0) => {
  let sql = `
    SELECT 
      s.*, 
      u.name AS user_name, 
      u.emp_id AS emp_id
    FROM shops s
    LEFT JOIN users u ON s.user_id = u.user_id
  `;
  const values = [];

  const type = Number(employee_type);
  const conditions = [];

  if (type === 2 || type === 3) {
    conditions.push(`s.user_id = ?`);
    values.push(user_id);
  }

  if (search) {
    conditions.push(`s.shop_name LIKE ?`);
    values.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ` ORDER BY s.shop_id DESC LIMIT ? OFFSET ?`;
  values.push(limit, offset);

  try {
    const [rows] = await db.query(sql, values);
    return rows;
  } catch (error) {
    console.error('Query Error:', error);
    throw error;
  }
};

const countShopsByRole = async (user_id, employee_type, search = '') => {
  let sql = `SELECT COUNT(*) AS total FROM shops s`;
  const values = [];
  const conditions = [];

  const type = Number(employee_type);
  if (type === 2 || type === 3) {
    conditions.push(`s.user_id = ?`);
    values.push(user_id);
  }

  if (search) {
    conditions.push(`s.shop_name LIKE ?`);
    values.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  const [rows] = await db.query(sql, values);
  return rows[0].total;
};



module.exports = {
  createShop,
  getShopsByRole,
  countShopsByRole
};
