const Sale = require('../models/saleModel');

exports.saleCreate = async (req, res) => {
  const {
    shop_id,
    user_id,
    number_purches_item,
    selling_rate,
    total_amount,
    locker_type,
  } = req.body;

  try {
    const sale = {
      shop_id,
      user_id,
      created_at: new Date(),
      number_purches_item,
      selling_rate,
      total_amount,
      locker_type,
    };

    const result = await Sale.createSale(sale);

    res.status(201).json({
      message: 'Sale created successfully',
      saleId: result.insertId,
    });

  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({
      message: 'Failed to create sale',
      error: error.message,
    });
  }
};
