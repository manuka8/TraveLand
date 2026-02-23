'use strict';

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createUser, findByEmail } = require('../models/userModel');
const { pool } = require('../config/db');

async function createAdmin() {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log('Usage: node src/scripts/createAdmin.js <full_name> <email> <password>');
        process.exit(1);
    }

    const [full_name, email, password] = args;

    try {
        // Check if user exists
        const existing = await findByEmail(email);
        if (existing) {
            console.error(`Error: User with email ${email} already exists.`);
            process.exit(1);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // role_id 2 is 'admin' (based on users.sql seeding)
        const userId = await createUser({
            full_name,
            email,
            password_hash,
            role_id: 2
        });

        console.log(`✔ Admin user created successfully! ID: ${userId}`);
        process.exit(0);
    } catch (err) {
        console.error('✖ Error creating admin:', err.message);
        process.exit(1);
    } finally {
        // Close connection pool
        await pool.end();
    }
}

createAdmin();
