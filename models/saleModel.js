const db = require('../config/db.config');

const createSale = async (sale) => {
  const sql = `
    INSERT INTO sales 
      (shop_id, user_id, start_date, end_date, number_purches_item, selling_rate, total_amount, locker_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    sale.shop_id,
    sale.user_id,
    sale.start_date,
    sale.end_date,
    sale.number_purches_item,
    sale.selling_rate,
    sale.total_amount,
    sale.locker_type,
  ];

  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
  }
};

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

  if (start_date && end_date) {
    conditions.push(`DATE(start_date) BETWEEN ? AND ?`);
    values.push(start_date, end_date);
  } else if (start_date) {
    conditions.push(`DATE(start_date) = ?`);
    values.push(start_date);
  } else {
    // If no start_date/end_date, default to today
    const today = new Date().toISOString().slice(0, 10);
    conditions.push(`DATE(start_date) = ?`);
    values.push(today);
  }

  if (user_id) {
    conditions.push('sales.user_id = ?');
    values.push(user_id);
  }

  if (shop_id) {
    conditions.push('sales.shop_id = ?');
    values.push(shop_id);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY start_date DESC LIMIT 10';

  try {
    const [rows] = await db.query(sql, values);
    return rows;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createSale,
  getSales
};
