const Attendance = require('../models/attendanceModel');
const Location = require('../models/locationModel');
const moment = require('moment');

const startAttendance = async (req, res) => {
  const { user_id, attend_date, attend_start_time, attend_status = 1, cordinate, created_at, updated_at } = req.body;

  if (!user_id || !Array.isArray(cordinate)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

   if (!Array.isArray(cordinate) || cordinate.length === 0) {
    return res.status(400).json({ message: 'Your location is required' });
  }

  try {
    const result = {
      user_id,
      attend_date,
      attend_start_time,
      attend_end_time: null,
      attend_status,
      created_at: new Date(),
      updated_at: new Date()
    }
    const attendanceResult = await Attendance.createAttendance(result);

    const attend_id = attendanceResult.insertId;

    await Location.saveLocation({
      attend_id,
      user_id,
      cordinate,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({ message: 'Your attendance is started and location update is running.', attend_id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const stopAttendance = async (req, res) => {
  const { attend_id, user_id, attend_end_time, cordinate, created_at, updated_at } = req.body;
  if (!attend_id) {
    return res.status(400).json({ message: 'attend id is required' });
  }

   if (!Array.isArray(cordinate) || cordinate.length === 0) {
    return res.status(400).json({ message: 'Your location is required' });
  }

  try {
    await Attendance.updateEndTime({ attend_id, attend_end_time, created_at, updated_at });

    await Location.updateLocation({
      attend_id,
      user_id,
      cordinate
    });

    res.status(200).json({ message: 'Your attendance is submited successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateLocation = async (req, res) => {
  const { attend_id, user_id, cordinate, created_at, updated_at } = req.body;

   if (!attend_id || !Array.isArray(cordinate) || cordinate.length === 0) {
    return res.status(400).json({ message: 'Your location is required' });
  }

  try {
    await Location.updateLocation({
      attend_id,
      cordinate,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAttendanceWithLocation = async (req, res) => {
  const { user_id, attend_date } = req.query;

  if (!user_id || !attend_date) {
    return res.status(400).json({ success: false, message: "user_id and attend_date are required" });
  }

  try {
    const data = await Attendance.fetchAttendanceWithLocation(user_id, attend_date);

    const formattedData = data.map(item => ({
      ...item,
      attend_date: moment(item.attend_date).format("YYYY-MM-DD")
    }));

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error("Error fetching attendance with location:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const fetchMonthlyAttendance = async (req, res) => {
  const { user_id, month } = req.query;

  if (!user_id || !month) {
    return res.status(400).json({ success: false, message: "user_id and month are required" });
  }

  try {
    const data = await Attendance.fetchAttendanceByMonth({ user_id, month });
     const formattedData = data.map(item => ({
      ...item,
      attend_date: moment(item.attend_date).format("YYYY-MM-DD")
    }));
    
    res.status(200).json({
      success: true,
      total: data.length,
      data: formattedData
    });
  } catch (error) {
    console.error("Monthly attendance fetch error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  startAttendance,
  stopAttendance,
  updateLocation,
  getAttendanceWithLocation,
  fetchMonthlyAttendance
};

