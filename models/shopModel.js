const db = require('../config/db.config');

// Function to create a new shop
const createShop = async (shop) => {
  const sql = `INSERT INTO shops ( shop_name, shop_address, shop_photo, shop_owner_name, shop_phone_number, shop_location, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [shop.shop_name, shop.shop_address, shop.shop_photo, shop.shop_owner_name, shop.shop_phone_number, shop.shop_location, shop.user_id];
  
  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
    console.log(error);
  }
};

module.exports = {
  createShop,
};
