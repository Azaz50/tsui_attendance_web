const Sale = require('../models/saleModel');

// Create Sale (Already done by you)
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
      start_date: new Date(),
      end_date: new Date(),
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

// New: Get Sales
exports.getSale = async (req, res) => {
  const { start_date, end_date, user_id, shop_id } = req.query;

  try {
    const sales = await Sale.getSales({ start_date, end_date, user_id, shop_id });

    res.status(200).json({
      message: 'Sales fetched successfully',
      data: sales,
    });

  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({
      message: 'Failed to fetch sales',
      error: error.message,
    });
  }
};
