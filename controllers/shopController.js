const path = require('path');
const multer = require('multer');
const Shop = require('../models/shopModel');

exports.createShop = async (req, res) => {
  const { shop_name, shop_address, shop_owner_name, shop_phone_number, shop_location, user_id, created_at, updated_at } = req.body;

  try {

    const shop = {
      shop_name,
      shop_address,
      shop_owner_name,
      shop_phone_number,
      shop_location,
      user_id,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await Shop.createShop(shop);

    res.status(201).json({
      message: 'Shop created successfully',
      shopId: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create shop',
      error: error.message
    });
  }
};

exports.getAllShopsByRole = async (req, res) => {
  const user_id = req.user?.user_id;
  const employee_type = req.user?.employee_type;
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  if (!user_id || !employee_type) {
    return res.status(401).json({ message: 'Unauthorized. User info missing.' });
  }

  try {
    const shops = await Shop.getShopsByRole(user_id, employee_type, search, limit, offset);
    const total = await Shop.countShopsByRole(user_id, employee_type, search); // We'll add this below

    res.status(200).json({
      message: 'Shop list fetched successfully',
      data: shops,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit
      }
    });
  } catch (error) {
    console.error('Error fetching shop list:', error);
    res.status(500).json({
      message: 'Failed to fetch shop list',
      error: error.message
    });
  }
};

