const Visit = require('../models/visitModel');
const moment = require('moment-timezone');


exports.visitCreate = async (req, res) => {
  const {
    shop_id,
    user_id,
    created_at,
    updated_at,
    visit_date_time
  } = req.body;

  try {
    const visit = {
      shop_id,
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
      visit_date_time
    };

    const result = await Visit.createVisit(visit);

    res.status(201).json({
      message: 'shop visited successfully',
      visitId: result.insertId,
    });

  } catch (error) {
    console.error('Error creating visit:', error);
    res.status(500).json({
      message: 'Failed to create visit',
      error: error.message,
    });
  }
};

exports.getVisitList = async (req, res) => {
  const user_id = req.query.user_id;
  const date = req.query.date || null;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  try {
    const visits = await Visit.getVisitList(user_id, date);

     const formatted = visits.map((v) => ({
      ...v,
      visit_date_time: moment(v.visit_date_time).tz('Asia/Kolkata').format('YYYY-MM-DD'),
    }));

    res.status(200).json({
      message: "Visit list fetched successfully",
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching visit list:', error);
    res.status(500).json({
      message: 'Failed to fetch visit list',
      error: error.message
    });
  }
};
