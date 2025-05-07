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


const getShopsByRole = async (user_id, employee_type) => {
  let sql = `SELECT * FROM shops`;
  let values = [];

  const type = Number(employee_type);

  if (type === 2 || type === 3) {
    sql += ` WHERE user_id = ?`;
    values.push(user_id);
  }

  try {
    const [rows] = await db.query(sql, values);
    return rows;
  } catch (error) {
    throw error;
  }
};



module.exports = {
  createShop,
  getShopsByRole
};
