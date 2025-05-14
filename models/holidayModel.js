const db = require('../config/db.config');
const path = require('path');
const fs = require('fs');

const createHoliday = async (holiday) => {
  const sql = `INSERT INTO holiday_tables (employee_type, holiday_photo) VALUES (?, ?)`;
  const values = [holiday.employee_type, holiday.holiday_photo];
  const [result] = await db.query(sql, values);
  return result;
};

const fetchHolidays = async () => {
  const [rows] = await db.query(`SELECT * FROM holiday_tables`);
  return rows;
};

const deleteHoliday = async (holiday_id) => {
  const sql = `DELETE FROM holiday_tables WHERE holiday_id = ?`;
  const [result] = await db.query(sql, [holiday_id]);
  return result;
};

const createOrUpdateHoliday = async (holiday) => {
  const [rows] = await db.query(
    `SELECT * FROM holiday_tables WHERE employee_type = ?`,
    [holiday.employee_type]
  );

  if (rows.length > 0) {
    const oldPhoto = rows[0].holiday_photo;
    const oldPhotoPath = path.join(__dirname, '../uploads', oldPhoto);

    try {
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    } catch (err) {
      console.error('Error deleting old photo:', err.message);
    }

    const [result] = await db.query(
      `UPDATE holiday_tables SET holiday_photo = ? WHERE employee_type = ?`,
      [holiday.holiday_photo, holiday.employee_type]
    );

    // Return the existing holiday_id from the fetched row
    return { isUpdated: true, result: { insertId: rows[0].holiday_id } };
  } else {
    const [result] = await db.query(
      `INSERT INTO holiday_tables (employee_type, holiday_photo) VALUES (?, ?)`,
      [holiday.employee_type, holiday.holiday_photo]
    );
    return { isUpdated: false, result };
  }
};

module.exports = {
  createHoliday,
  fetchHolidays,
  deleteHoliday,
  createOrUpdateHoliday
};
