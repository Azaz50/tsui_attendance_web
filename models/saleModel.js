const db = require('../config/db.config');

// Function to create a new sale
const createSale = async (sale) => {
  const sql = `
    INSERT INTO sales 
      (shop_id, user_id, created_at, number_purches_item, selling_rate, total_amount, locker_type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    sale.shop_id,
    sale.user_id,
    sale.created_at,
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

module.exports = {
  createSale,
};
