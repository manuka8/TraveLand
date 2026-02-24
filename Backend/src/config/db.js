'use strict';

const mysql = require('mysql2/promise');
require('dotenv').config();

// Railway MySQL plugin injects: MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE
// For local XAMPP dev, fall back to DB_* vars in .env
// NOTE: Use 127.0.0.1 (not localhost) to avoid IPv6 (::1) connection issues
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306', 10),
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'traveland_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
    ssl: process.env.MYSQLHOST ? { rejectUnauthorized: false } : undefined,
});

/**
 * Test the database connection
 * @returns {Promise<void>}
 */
async function testConnection() {
    try {
        const conn = await pool.getConnection();
        conn.release();
        return true;
    } catch (err) {
        const host = process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1';
        const db = process.env.MYSQLDATABASE || process.env.DB_NAME || 'traveland_db';
        throw new Error(
            `Cannot connect to MySQL at "${host}" / database "${db}". ` +
            `Original error: [${err.code || 'UNKNOWN'}] ${err.message || err.toString()}`
        );
    }
}

module.exports = { pool, testConnection };
