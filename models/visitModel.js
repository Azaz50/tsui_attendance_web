const db = require('../config/db.config');

// Function to create a new visit
const createVisit = async (visit) => {
  const sql = `INSERT INTO visits ( shop_id, user_id, visit_date_time) VALUES (?, ?, ?)`;
  const values = [visit.shop_id, visit.user_id, visit.visit_date_time];
  
  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
    console.log(error);
  }
};

module.exports = {
  createVisit,
};
