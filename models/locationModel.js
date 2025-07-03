const db = require('../config/db.config');

const saveLocation = async ({ attend_id, user_id, cordinate, time }) => {
  // Always save as [lat, lng, time]
  const initialArray = JSON.stringify([
    [cordinate[0], cordinate[1], time]
  ]);

  await db.query(
    `
    INSERT INTO locations 
      (attend_id, user_id, cordinate, created_at, updated_at)
    VALUES 
      (?, ?, ?, NOW(), NOW())
    `,
    [attend_id, user_id, initialArray]
  );
};

const updateLocation = async (attend_id, cordinate, time) => {
  const [rows] = await db.query(
    `
    SELECT cordinate 
    FROM locations 
    WHERE attend_id = ?
    `,
    [attend_id]
  );

  let previousCoordinates = [];

  if (rows.length > 0 && rows[0].cordinate) {
    try {
      previousCoordinates = JSON.parse(rows[0].cordinate);
      if (!Array.isArray(previousCoordinates)) {
        previousCoordinates = [];
      }
    } catch (err) {
      previousCoordinates = [];
    }
  }

  // Always push [lat, lng, time]
  previousCoordinates.push([cordinate[0], cordinate[1], time]);

  await db.query(
    `
    UPDATE locations 
    SET cordinate = ?, updated_at = NOW()
    WHERE attend_id = ?
    `,
    [JSON.stringify(previousCoordinates), attend_id]
  );
};



module.exports = {
  saveLocation,
  updateLocation
};

