const db = require('../config/db.config');

const createSale = async (sale) => {
  const sql = `
    INSERT INTO sales 
      (shop_id, user_id, date, time, number_purches_item, selling_rate, total_amount, locker_type, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    sale.shop_id,
    sale.user_id,
    sale.date,
    sale.time,
    sale.number_purches_item,
    sale.selling_rate,
    sale.total_amount,
    sale.locker_type,
    sale.created_at,
    sale.updated_at
  ];

  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
  }
};


// saleModel.js
const getSales = async ({ start_date, end_date, user_id, shop_id }) => {
  let sql = `
    SELECT 
      sales.*,
      shops.shop_name,
      shops.shop_address,
      shops.shop_owner_name,
      shops.shop_phone_number,
      shops.shop_location
    FROM sales
    LEFT JOIN shops ON sales.shop_id = shops.shop_id
  `;

  const conditions = [];
  const values = [];

  // Date filtering
  if (start_date && end_date) {
    conditions.push(`DATE(sales.date) BETWEEN ? AND ?`);
    values.push(start_date, end_date);
  } else if (start_date) {
    conditions.push(`DATE(sales.date) = ?`);
    values.push(start_date);
  } else if (end_date) {
    conditions.push(`DATE(sales.date) = ?`);
    values.push(end_date);
  }

  // User ID and Shop ID as integers
  if (user_id) {
    conditions.push(`sales.user_id = ?`);
    values.push(parseInt(user_id, 10));
  }

  if (shop_id) {
    conditions.push(`sales.shop_id = ?`);
    values.push(parseInt(shop_id, 10));
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY sales.date DESC, sales.time DESC LIMIT 10';

  try {
    const [rows] = await db.query(sql, values);
    console.log('Rows Returned:', rows);
    return rows;
  } catch (error) {
    console.error('Query Error:', error);
    throw error;
  }
};


module.exports = {
  createSale,
  getSales
};
