const mysql = require('mysql2');
require('dotenv').config();

// Buat connection pool untuk performa lebih baik
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '@21baplanGGG',
    database: process.env.DB_NAME || 'api_system',
    port: process.env.DB_PORT || 3309,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Gunakan promise wrapper untuk async/await
const promisePool = pool.promise();

// Test koneksi database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        return;
    }
    console.log('✓ Database connected successfully');
    connection.release();
});

module.exports = promisePool;
