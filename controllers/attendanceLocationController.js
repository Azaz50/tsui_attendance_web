const Attendance = require('../models/attendanceModel');
const Location = require('../models/locationModel');

const startAttendance = async (req, res) => {
  const { user_id, attend_date, attend_start_time, attend_status = 1, cordinate, recorded_at } = req.body;
  if (!user_id || !attend_date || !attend_start_time || !cordinate || !recorded_at) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = { 
      user_id,
      attend_date,
      attend_start_time,
      attend_end_time: null,
      attend_status
    }
    const attendanceResult = await Attendance.createAttendance(result);

    const attend_id = attendanceResult.insertId;

    await Location.saveLocation({
      attend_id,
      user_id,
      cordinate,
      recorded_at
    });

    res.status(201).json({ message: 'Attendance started and location saved', attend_id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const stopAttendance = async (req, res) => {
  const { attend_id, user_id, attend_end_time, cordinate, recorded_at } = req.body;
  if (!attend_id || !user_id || !attend_end_time || !cordinate || !recorded_at) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await Attendance.updateEndTime({ attend_id, attend_end_time });

    await Location.updateLocation({
      attend_id,
      user_id,
      cordinate,
      recorded_at
    });

    res.status(200).json({ message: 'Attendance stopped and location updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateLocation = async (req, res) => {
  const { attend_id, user_id, cordinate } = req.body;
  if (!attend_id || !cordinate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await Location.updateLocation({
      attend_id,
      cordinate,
    });

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  startAttendance,
  stopAttendance,
  updateLocation
};

