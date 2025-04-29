const db = require('../config/db.config');

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

module.exports = {
  createHoliday,
  fetchHolidays,
  deleteHoliday,
};
