const Visit = require('../models/visitModel');

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
