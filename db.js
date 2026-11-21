const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool for efficient MySQL handling
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'job_portal',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export promise-based pool for async/await usage
const db = pool.promise();

// Function to test MySQL connection on server startup
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL Database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('⚠️ MySQL Connection Warning:', error.message);
    console.log('💡 Note: Ensure MySQL service is running and database "job_portal" exists.');
  }
};

module.exports = { db, testConnection };
