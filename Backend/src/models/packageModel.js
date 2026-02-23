'use strict';

const { pool } = require('../config/db');

async function getAll({ destination_id, min_price, max_price, limit = 12, offset = 0 }) {
    let where = 'WHERE p.is_available = 1';
    const params = [];

    if (destination_id) {
        where += ' AND p.destination_id = ?';
        params.push(destination_id);
    }
    if (min_price != null) {
        where += ' AND p.price_per_person >= ?';
        params.push(min_price);
    }
    if (max_price != null) {
        where += ' AND p.price_per_person <= ?';
        params.push(max_price);
    }

    const [rows] = await pool.execute(
        `SELECT p.*, p.price_per_person AS price, p.duration_days AS duration, d.name AS destination_name, d.country, d.image_url AS destination_image
     FROM packages p
     JOIN destinations d ON d.id = p.destination_id
     ${where} ORDER BY p.price_per_person ASC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );
    const [[{ total }]] = await pool.execute(
        `SELECT COUNT(*) AS total FROM packages p ${where}`, params
    );
    return { rows, total };
}

async function getById(id) {
    const [rows] = await pool.execute(
        `SELECT p.*, p.price_per_person AS price, p.duration_days AS duration, d.name AS destination_name, d.country, d.image_url AS destination_image
     FROM packages p
     JOIN destinations d ON d.id = p.destination_id
     WHERE p.id = ? AND p.is_available = 1 LIMIT 1`,
        [id]
    );
    return rows[0] || null;
}

async function create(data) {
    const { destination_id, title, description, itinerary, duration_days, price_per_person, max_guests, image_url } = data;
    const [result] = await pool.execute(
        `INSERT INTO packages (destination_id, title, description, itinerary, duration_days, price_per_person, max_guests, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            destination_id || null,
            title || null,
            description || null,
            itinerary ? JSON.stringify(itinerary) : null,
            duration_days || null,
            price_per_person || null,
            max_guests || 10,
            image_url || null
        ]
    );
    return result.insertId;
}

async function update(id, data) {
    const { destination_id, title, description, itinerary, duration_days, price_per_person, max_guests, image_url, is_available } = data;
    const [result] = await pool.execute(
        `UPDATE packages SET destination_id=?, title=?, description=?, itinerary=?,
     duration_days=?, price_per_person=?, max_guests=?, image_url=?, is_available=?, updated_at=NOW()
     WHERE id=?`,
        [
            destination_id || null,
            title || null,
            description || null,
            itinerary ? JSON.stringify(itinerary) : null,
            duration_days || null,
            price_per_person || null,
            max_guests || 10,
            image_url || null,
            is_available ?? 1,
            id
        ]
    );
    return result.affectedRows;
}

async function remove(id) {
    const [result] = await pool.execute(
        `UPDATE packages SET is_available = 0 WHERE id = ?`, [id]
    );
    return result.affectedRows;
}

module.exports = { getAll, getById, create, update, remove };
