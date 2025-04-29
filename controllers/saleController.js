const Sale = require('../models/saleModel');
const Visit = require('../models/visitModel');

exports.saleCreate = async (req, res) => {
  const {
    shop_id,
    user_id,
    number_purches_item,
    selling_rate,
    total_amount,
    locker_type
  } = req.body;

  const timestamp = new Date();

  try {
    // Create Sale
    const sale = {
      shop_id,
      user_id,
      start_date: null,
      end_date: null,
      number_purches_item,
      selling_rate,
      total_amount,
      locker_type,
      created_at: timestamp,
      updated_at: timestamp
    };

    const saleResult = await Sale.createSale(sale);

    // Create Visit linked to Sale
    const visit = {
      shop_id,
      user_id,
      visit_date_time: null,
    };

    await Visit.createVisit(visit);

    res.status(201).json({
      message: 'Sale and Visit created successfully',
      saleId: saleResult.insertId,
    });

  } catch (error) {
    console.error('Error creating sale or visit:', error);
    res.status(500).json({
      message: 'Failed to create sale or visit',
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
