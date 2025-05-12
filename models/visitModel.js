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

const getVisitList = async (user_id, shop_name = null) => {
  let sql = `
    SELECT 
      s.shop_name,
      s.shop_address,
      s.shop_owner_name,
      v.visit_date_time
    FROM visits v
    JOIN shops s ON v.user_id = s.user_id
    WHERE v.user_id = ?
  `;
  const values = [user_id];

  if (shop_name) {
    sql += ` AND s.shop_name LIKE ?`;
    values.push(`%${shop_name}%`);
  } else {
    sql += ` AND DATE(v.visit_date_time) = CURDATE()`;
  }

  sql += ` ORDER BY v.visit_date_time DESC`;

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
