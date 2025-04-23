const Attendance = require('../models/attendanceModel');
const Location = require('../models/locationModel');
const db = require('../config/db.config');

const handleAttendanceAndLocation = async (req, res) => {
  const { user_id, cordinate } = req.body;
  if (!user_id || !cordinate) {
    return res.status(400).json({ message: "user_id and cordinate are required" });
  }

  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    // 1. Check if attendance exists for today
    const [existing] = await db.query(
      `SELECT * FROM attendances WHERE user_id = ? AND attend_date = ?`,
      [user_id, today]
    );

    let attend_id;

    if (existing.length > 0) {
      // 2. If present ➝ save location only
      attend_id = existing[0].id;

      await Location.updateLocation({
        attend_id,
        user_id,
        cordinate,
        recorded_at: now
      });

      return res.status(200).json({
        message: "Attendance already exists, location saved",
        attend_id
      });

    } else {
      const { user_id, attend_date, attend_start_time, attend_end_time, attend_status } = req.body;
      const result = { user_id, attend_date, password: attend_start_time, attend_end_time, attend_status};
      // 3. If not present ➝ create attendance and then save location
      const attendanceResult = await Attendance.createAttendance(result);

      attend_id = attendanceResult.insertId;

      await Location.saveLocation({
        attend_id,
        user_id,
        cordinate,
        recorded_at: now
      });

      return res.status(201).json({
        message: "Attendance created and location saved",
        attend_id
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  handleAttendanceAndLocation
};
