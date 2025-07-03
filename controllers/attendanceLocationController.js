const Attendance = require('../models/attendanceModel');
const Location = require('../models/locationModel');
const moment = require('moment');

const startAttendance = async (req, res) => {
  const { user_id, attend_date, attend_start_time, cordinate, time } = req.body;

  // Validate required fields
  if (
    !user_id ||
    !attend_date ||
    !attend_start_time ||
    !Array.isArray(cordinate) ||
    cordinate.length === 0 ||
    !time
  ) {
    return res.status(400).json({ message: "Missing required fields, location, or time" });
  }

  try {
    // Check if an attendance record exists for this date
    const existingAttendance = await Attendance.getLatestAttendance(user_id, attend_date);

    if (existingAttendance) {
      if (existingAttendance.attend_status === 1) {
        // Append the new cordinate + time
        await Location.updateLocation(existingAttendance.attend_id, cordinate, time);

        return res.status(200).json({
          message: "Your attendance is already started. Location has been updated.",
          attend_id: existingAttendance.attend_id,
        });
      } else if (existingAttendance.attend_status === 0) {
        return res.status(200).json({
          message: "Your attendance is already done.",
        });
      }
    }

    // No attendance found: create new attendance record
    const attend_id = await Attendance.createAttendance({
      user_id,
      attend_date,
      attend_start_time,
      attend_status: 1
    });

    // Save the initial location with time
    await Location.saveLocation({
      attend_id,
      user_id,
      cordinate,
      time
    });

    res.status(201).json({
      message: "Your attendance has started and location saved.",
      attend_id
    });

  } catch (err) {
    console.error("startAttendance error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const stopAttendance = async (req, res) => {
  const { attend_id, user_id, attend_end_time, cordinate, time } = req.body;

  if (!attend_id) {
    return res.status(400).json({ message: 'attend_id is required' });
  }

  if (!Array.isArray(cordinate) || cordinate.length === 0 || !time) {
    return res.status(400).json({ message: 'Your location and time are required' });
  }

  try {
    await Attendance.updateEndTime({
      attend_id,
      attend_end_time
    });

    await Location.updateLocation(attend_id, cordinate, time);

    res.status(200).json({ 
      message: 'Your attendance is submitted successfully',
      attend_id: attend_id 
    });
  } catch (err) {
    console.error("stopAttendance error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateLocation = async (req, res) => {
  const { attend_id, cordinate, time } = req.body;

  if (
    !attend_id ||
    !Array.isArray(cordinate) ||
    cordinate.length === 0 ||
    !time
  ) {
    return res.status(400).json({ message: 'attend_id, location, and time are required' });
  }

  try {
    await Location.updateLocation(attend_id, cordinate, time);

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (err) {
    console.error('updateLocation error:', err);
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

