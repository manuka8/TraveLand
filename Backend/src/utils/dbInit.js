'use strict';

const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const SQL_DIR = path.join(__dirname, 'dbUtils');

/**
 * Load a .sql file and execute it against the DB pool.
 * Splits on semicolons to handle multi-statement files.
 * @param {string} filename
 */
async function loadSqlFile(filename) {
    const filePath = path.join(SQL_DIR, filename);
    const sql = fs.readFileSync(filePath, 'utf8');

    // Split into individual statements and filter empty ones
    const statements = sql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    for (const statement of statements) {
        await pool.execute(statement);
    }

    console.log(`  ✔ ${filename} loaded`);
}

/**
 * Initialize the database: create tables and seed roles.
 */
async function initDatabase() {
    const sqlFiles = [
        'users.sql',
        'destinations.sql',
        'packages.sql',
        'bookings.sql',
        'payments.sql',
        'reviews.sql',
        'hotels.sql',
        'gallery.sql',
    ];

    for (const file of sqlFiles) {
        await loadSqlFile(file);
    }
}

module.exports = { initDatabase };
