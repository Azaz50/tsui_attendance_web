const path = require('path');
const fs = require('fs');
const Holiday = require('../models/holidayModel');

exports.createHoliday = async (req, res) => {
  try {
    const { employee_type } = req.body;
    const uploadedPhoto = req.files?.holiday_photo;

    if (!employee_type || !uploadedPhoto) {
      return res.status(400).json({ message: 'Employee type and holiday photo are required' });
    }

    const fileName = `holiday_${Date.now()}${path.extname(uploadedPhoto.name)}`;
    const uploadPath = path.join(__dirname, '../uploads', fileName);

    await uploadedPhoto.mv(uploadPath);

    const holiday = {
      employee_type,
      holiday_photo: fileName
    };

    const result = await Holiday.createHoliday(holiday);

    res.status(201).json({ message: 'Holiday created', holidayId: result.insertId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating holiday', error: error.message });
  }
};

exports.getHolidays = async (req, res) => {
    try {
      const holidays = await Holiday.fetchHolidays();
  
      const baseUrl = `${req.protocol}://${req.get('host')}/api/uploads/`;
  
      const updatedHolidays = holidays.map(holiday => {
        return {
          ...holiday,
          holiday_photo: holiday.holiday_photo ? baseUrl + holiday.holiday_photo : null
        };
      });
  
      res.json(updatedHolidays);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching holidays', error: error.message });
    }
  };
  

exports.deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;

    // Optionally delete the photo from disk
    const holidays = await Holiday.fetchHolidays();
    const target = holidays.find(h => h.holiday_id == id);

    if (target && target.holiday_photo) {
      const filePath = path.join(__dirname, '../uploads', target.holiday_photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Holiday.deleteHoliday(id);
    res.json({ message: 'Holiday deleted' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting holiday', error: error.message });
  }
};
