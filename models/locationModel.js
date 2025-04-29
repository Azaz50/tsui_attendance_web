const db = require('../config/db.config');

const saveLocation = async ({ attend_id, user_id, cordinate, recorded_at, created_at, updated_at }) => {
  await db.query(`
    INSERT INTO locations (attend_id, user_id, cordinate, recorded_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [attend_id, user_id, cordinate, recorded_at, created_at, updated_at]
  );
};

const updateLocation = async ({ attend_id, cordinate }) => {
  await db.query(
    `
    UPDATE locations 
    SET cordinate = ?
    WHERE attend_id = ?`,
    [cordinate, attend_id]
  );
};

module.exports = {
  saveLocation,
  updateLocation
};

