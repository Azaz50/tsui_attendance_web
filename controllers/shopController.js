const path = require('path');
const multer = require('multer');
const Shop = require('../models/shopModel');

exports.createShop = async (req, res) => {
  const { shop_name, shop_address, shop_owner_name, shop_phone_number, shop_location, user_id } = req.body;

  try {
    // Handle shop photo if provided
    let shopPhoto = req.files?.shop_photo;
    let shop_photo = shopPhoto ? `shop_${Date.now()}${path.extname(shopPhoto.name)}` : null;

    if (shopPhoto) {
      await shopPhoto.mv(path.join(__dirname, "../uploads", shop_photo));
    }

    const shop = {
      shop_name,
      shop_address,
      shop_photo,
      shop_owner_name,
      shop_phone_number,
      shop_location,
      user_id,
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
