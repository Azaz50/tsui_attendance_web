const db = require('../config/db.config');

const saveLocation = async ({ attend_id, user_id, cordinate, recorded_at, created_at, updated_at }) => {
  const initialArray = JSON.stringify([cordinate]);
  await db.query(`
    INSERT INTO locations (attend_id, user_id, cordinate, recorded_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [attend_id, user_id, initialArray, recorded_at, created_at, updated_at]
  );
};


const updateLocation = async ({ attend_id, cordinate }) => {
  const [rows] = await db.query(`SELECT cordinate FROM locations WHERE attend_id = ?`, [attend_id]);

  let previousCordinates = [];

  if (rows.length > 0 && rows[0].cordinate) {
    try {
      previousCordinates = JSON.parse(rows[0].cordinate);
      if (!Array.isArray(previousCordinates)) {
        previousCordinates = [];
      }
    } catch (err) {
      previousCordinates = [];
    }
  }

  previousCordinates.push(cordinate);

  await db.query(
    `
    UPDATE locations 
    SET cordinate = ?
    WHERE attend_id = ?`,
    [JSON.stringify(previousCordinates), attend_id]
  );
};


module.exports = {
  saveLocation,
  updateLocation
};

