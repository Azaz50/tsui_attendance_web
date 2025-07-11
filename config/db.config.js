require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a connection pool (recommended for handling multiple queries)
const pool = mysql.createPool({
  host: process.env.DB_HOST,          
  user: process.env.DB_USER,               
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Export the pool to be used in other parts of the app
module.exports = pool;
