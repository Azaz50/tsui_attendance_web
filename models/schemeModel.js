const db = require('../config/db.config');

// Function to create a new scheme
const createScheme = async (scheme) => {
  const sql = `
    INSERT INTO schemes 
      ( scheme_title, scheme_description, scheme_banner_photo, created_at, updated_at)
    VALUES ( ?, ?, ?, ?, ?)
  `;

  const values = [
    scheme.scheme_title,
    scheme.scheme_description,
    scheme.scheme_photo,
    scheme.created_at,
    scheme.updated_at
  ];

  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllSchemes = async () => {
  const sql = `SELECT * FROM schemes ORDER BY created_at DESC`;

  try {
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createScheme,
  getAllSchemes
};
