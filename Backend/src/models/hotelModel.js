'use strict';

const { pool } = require('../config/db');

/**
 * Get all hotels with optional pagination
 */
async function getAllHotels({ limit = 20, offset = 0 } = {}) {
    const [rows] = await pool.execute(
        `SELECT * FROM hotels 
         WHERE is_active = 1 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    const [[{ total }]] = await pool.execute(`SELECT COUNT(*) AS total FROM hotels WHERE is_active = 1`);
    return { rows, total };
}

/**
 * Get single hotel by ID
 */
async function getById(id) {
    const [rows] = await pool.execute(`SELECT * FROM hotels WHERE id = ?`, [id]);
    return rows[0] || null;
}

/**
 * Create a new hotel
 */
async function createHotel({ name, description, address, city, rating, amenities, price_per_night, image_url }) {
    const [result] = await pool.execute(
        `INSERT INTO hotels (name, description, address, city, rating, amenities, price_per_night, image_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            name || null,
            description || null,
            address || null,
            city || null,
            rating || 0.0,
            amenities || null,
            price_per_night || null,
            image_url || null
        ]
    );
    return result.insertId;
}

/**
 * Update a hotel
 */
async function updateHotel(id, data) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = ?`);
        values.push(value === undefined ? null : value);
    }

    values.push(id);
    const [result] = await pool.execute(
        `UPDATE hotels SET ${fields.join(', ')} WHERE id = ?`,
        values
    );
    return result.affectedRows;
}

/**
 * Delete (soft delete) hotel
 */
async function deleteHotel(id) {
    const [result] = await pool.execute(`UPDATE hotels SET is_active = 0 WHERE id = ?`, [id]);
    return result.affectedRows;
}

module.exports = {
    getAllHotels,
    getById,
    createHotel,
    updateHotel,
    deleteHotel
};
