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
        try {
            await pool.query(statement);
        } catch (err) {
            // Ignore "Duplicate column name", "Duplicate key name", and "Duplicate entry"
            // This makes the scripts idempotent and compatible across MySQL flavors.
            const ignoredCodes = ['ER_DUP_FIELDNAME', 'ER_DUP_KEYNAME', 'ER_DUP_ENTRY', '1060', '1061', '1062'];
            if (ignoredCodes.includes(err.code) || ignoredCodes.includes(String(err.errno))) {
                continue;
            }
            throw err;
        }
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
        'package_overhaul.sql',
    ];

    for (const file of sqlFiles) {
        await loadSqlFile(file);
    }
}

module.exports = { initDatabase };
