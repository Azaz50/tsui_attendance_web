const path = require('path');
const multer = require('multer');
const Shop = require('../models/schemeModel');

exports.createScheme = async (req, res) => {
  const { scheme_title, scheme_description } = req.body;

  try {
    // Handle scheme banner photo if provided
    let uploadedPhoto = req.files?.scheme_photo;
    let scheme_banner_photo = uploadedPhoto ? `scheme_${Date.now()}${path.extname(uploadedPhoto.name)}` : null;

    if (!scheme_banner_photo) {
      return res.status(400).json({ message: "Scheme banner photo is required" });
    }

    await uploadedPhoto.mv(path.join(__dirname, "../uploads", scheme_banner_photo));

    const scheme = {
      scheme_title,
      scheme_description,
      scheme_photo: scheme_banner_photo,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await Shop.createScheme(scheme);

    res.status(201).json({
      message: 'Scheme created successfully',
      schemeId: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create scheme',
      error: error.message
    });
  }
};


exports.listSchemes = async (req, res) => {
  try {
    const schemes = await Shop.getAllSchemes();
    const baseUrl = `${req.protocol}://${req.get('host')}/api/uploads/`;
    const updatedSchemes = schemes.map((scheme) => {
      return {
        ...scheme,
        scheme_photo: scheme.scheme_banner_photo ? baseUrl + scheme.scheme_banner_photo : null
      };
    });

    res.status(200).json({
      message: 'Schemes fetched successfully',
      data: updatedSchemes
    });
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({
      message: 'Failed to fetch schemes',
      error: error.message
    });
  }
};
