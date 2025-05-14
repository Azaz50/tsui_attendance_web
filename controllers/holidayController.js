const path = require('path');
const fs = require('fs');
const Holiday = require('../models/holidayModel');
const Employee = require('../models/employeeTypeModel');
const db = require('../config/db.config');

exports.createHoliday = async (req, res) => {
  try {
    const { employee_type } = req.body;
    const uploadedPhoto = req.files?.holiday_photo;

    if (!employee_type || !uploadedPhoto) {
      return res.status(400).json({ message: 'Employee type and holiday photo are required' });
    }

    // Step 1: Get employee_type_id from employee_type table
    const [typeRows] = await db.query(
      'SELECT id FROM employee_types WHERE employee_type = ?',
      [employee_type]
    );

    if (typeRows.length === 0) {
      return res.status(404).json({ message: 'Invalid employee type' });
    }

    const employee_type_id = typeRows[0].id;

    // Step 2: Save photo
    const fileName = `holiday_${Date.now()}${path.extname(uploadedPhoto.name)}`;
    const uploadPath = path.join(__dirname, '../uploads', fileName);
    await uploadedPhoto.mv(uploadPath);

    const holiday = {
      employee_type: employee_type_id,
      holiday_photo: fileName
    };

    // Step 3: Create or Update holiday
    const { isUpdated, result } = await Holiday.createOrUpdateHoliday(holiday);

    const message = isUpdated ? 'Holiday photo updated' : 'Holiday created';
    res.status(201).json({ message, holidayId: result.insertId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating/updating holiday', error: error.message });
  }
};

exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.fetchHolidays();

    const baseUrl = `${req.protocol}://${req.get('host')}/api/uploads/`;

    const updatedHolidays = await Promise.all(holidays.map(async (holiday) => {
      let employeeType = null;
      try {
        employeeType = await Employee.getEmployeeTypeById(holiday.employee_type);
      } catch (err) {
        console.error(`Failed to get employee type for holiday ID ${holiday.holiday_id}:`, err.message);
      }

      return {
        ...holiday,
        employee_type: employeeType,
        holiday_photo: holiday.holiday_photo ? baseUrl + holiday.holiday_photo : null
      };
    }));

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
