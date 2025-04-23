const db = require('../config/db.config');

// Save a new location record
const saveLocation = async (location) => {
  const sql = `
    INSERT INTO locations (attend_id, user_id, cordinate, recorded_at)
    VALUES (?, ?, ?, ?)
  `;
  const values = [
    location.attend_id,
    location.user_id,
    location.cordinate,
    location.recorded_at
  ];

  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
  }
};

// Fetch all locations by attend_id
const getLocationsByAttendanceId = async (attend_id) => {
  const sql = `SELECT * FROM locations WHERE attend_id = ? ORDER BY recorded_at ASC`;

  try {
    const [rows] = await db.query(sql, [attend_id]);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Update a specific location entry
// const updateLocation = async (id, cordinate) => {
//   const sql = `UPDATE locations SET cordinate = ? WHERE id = ?`;

//   try {
//     const [result] = await db.query(sql, [cordinate, id]);
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

const updateLocation = async ({ attend_id, user_id, cordinate, recorded_at }) => {
    await db.query(`
      UPDATE locations 
      SET cordinate = ?, recorded_at = ? 
      WHERE id = attend_id = ?, user_id = ?`, [cordinate, recorded_at, attend_id, user_id]
    );
};
  
  

module.exports = {
  saveLocation,
  getLocationsByAttendanceId,
  updateLocation
};
