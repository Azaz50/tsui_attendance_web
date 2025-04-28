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

exports.getShop = async (req, res) => {
  const { shop_name } = req.query;

  // Access user_id from the decoded token
  const user_id = req.user?.user_id;

  // Check if user_id is available
  if (!user_id) {
    return res.status(401).json({ message: 'User ID not found in token' });
  }

  try {
    const shops = await Shop.getShop(user_id, shop_name);
    res.status(200).json({
      message: 'Shop list fetched successfully',
      data: shops
    });
  } catch (error) {
    console.error('Error in getShop controller:', error);
    res.status(500).json({
      message: 'Failed to fetch shop list',
      error: error.message
    });
  }
};


