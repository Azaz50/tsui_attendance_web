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

const getVisitList = async (user_id, shop_id = null) => {
  let sql = `
    SELECT DISTINCT
      s.shop_id,
      s.shop_name,
      s.shop_address,
      s.shop_owner_name
    FROM shops s
    WHERE s.user_id = ?
  `;

  const values = [user_id];

  // If shop_id is passed, filter that specific shop
  if (shop_id) {
    sql += ` AND s.shop_id = ?`;
    values.push(shop_id);
  } else {
    // Only include if that user_id exists in visits table
    sql += ` AND EXISTS (
      SELECT 1 FROM visits v
      WHERE v.user_id = s.user_id
    )`;
  }

  try {
    const [rows] = await db.query(sql, values);
    return rows;
  } catch (error) {
    console.error("Error fetching visit list:", error);
    throw error;
  }
};


module.exports = {
  createVisit,
  getVisitList
};
