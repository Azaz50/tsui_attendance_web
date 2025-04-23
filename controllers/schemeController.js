const path = require('path');
const multer = require('multer');
const Shop = require('../models/schemeModel');

exports.createScheme = async (req, res) => {
  const { scheme_title, scheme_description } = req.body;

  try {
    // Handle shop photo if provided
    let scheme_banner_photo = req.files?.scheme_photo;
    let scheme_photo = scheme_banner_photo ? `shop_${Date.now()}${path.extname(scheme_banner_photo.name)}` : null;

    // console.log(scheme_banner_photo);
    if (scheme_banner_photo) {
      await scheme_banner_photo.mv(path.join(__dirname, "../uploads", scheme_photo));
    }

    const shop = {
      scheme_title,
      scheme_description,
      scheme_photo,
    };
console.log(shop);
    const result = await Shop.createScheme(shop);

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
