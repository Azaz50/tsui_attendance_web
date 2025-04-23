const db = require('../config/db.config');

// Function to create a new attendance
const createAttendance = async (attendance) => {
  const sql = `
    INSERT INTO attendances 
      (user_id, attend_date, attend_start_time, attend_end_time, attend_status)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    attendance.user_id,
    attendance.attend_date,
    attendance.attend_start_time,
    attendance.attend_end_time,
    attendance.attend_status
  ];

  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
    createAttendance,
};
