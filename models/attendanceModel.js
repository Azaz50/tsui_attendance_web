const db = require('../config/db.config');

const createAttendance = async ({ user_id, attend_date, attend_start_time, attend_status, created_at, updated_at }) => {
  const [result] = await db.query(`
    INSERT INTO attendances (user_id, attend_date, attend_start_time, attend_status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, attend_date, attend_start_time, attend_status, created_at, updated_at]
  );
  return result;
};

const updateEndTime = async ({ attend_id, attend_end_time }) => {
  await db.query(`
    UPDATE attendances 
    SET attend_end_time = ?, attend_status = 0 
    WHERE attend_id = ?`,
    [attend_end_time, attend_id]
  );
};

const getAttendanceById = async (attend_id) => {
  const [rows] = await db.query(
    `SELECT * FROM attendances WHERE attend_id = ?`,
    [attend_id]
  );
  return rows;
};

const fetchAttendanceWithLocation = async (user_id, attend_date) => {
  const query = `
    SELECT 
      a.attend_id,
      a.user_id,
      a.attend_date,
      a.attend_start_time,
      a.attend_end_time,
      a.attend_status,
      l.loc_id,
      l.cordinate,
      l.recorded_at
    FROM attendances a
    LEFT JOIN locations l ON a.attend_id = l.attend_id
    WHERE a.user_id = ? AND a.attend_date = ?
    ORDER BY l.recorded_at ASC
  `;

  const [rows] = await db.query(query, [user_id, attend_date]);
  return rows;
};

const fetchAttendanceByMonth = async ({ user_id, month }) => {
  const query = `
    SELECT 
      a.attend_id,
      a.user_id,
      a.attend_date
    FROM attendances a
    LEFT JOIN locations l ON a.attend_id = l.attend_id
    WHERE a.user_id = ?
      AND MONTH(a.attend_date) = ?
    ORDER BY a.attend_date DESC
  `;

  const [rows] = await db.query(query, [user_id, month]);
  return rows;
};


module.exports = {
  createAttendance,
  updateEndTime,
  getAttendanceById,
  fetchAttendanceWithLocation,
  fetchAttendanceByMonth
};
