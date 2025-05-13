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

exports.getVisitList = async (req, res) => {
  const user_id = req.query.user_id;
  const shop_id = req.query.shop_id || null;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  try {
    const visits = await Visit.getVisitList(user_id, shop_id);

    res.status(200).json({
      message: "Visit list fetched successfully",
      data: visits
    });
  } catch (error) {
    console.error('Error fetching visit list:', error);
    res.status(500).json({
      message: 'Failed to fetch visit list',
      error: error.message
    });
  }
};
