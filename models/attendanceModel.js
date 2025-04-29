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

module.exports = {
  createAttendance,
  updateEndTime,
  getAttendanceById
  
};
