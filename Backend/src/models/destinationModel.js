'use strict';

const { pool } = require('../config/db');

async function getAll({ search = '', category = '', limit = 12, offset = 0 }) {
    let where = 'WHERE d.is_active = 1';
    const params = [];

    if (search) {
        where += ' AND (d.name LIKE ? OR d.country LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
        where += ' AND LOWER(d.category) = LOWER(?)';
        params.push(category);
    }

    const [rows] = await pool.execute(
        `SELECT *, name AS title, country AS location FROM destinations d ${where} ORDER BY d.is_featured DESC, d.avg_rating DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );
    const [[{ total }]] = await pool.execute(
        `SELECT COUNT(*) AS total FROM destinations d ${where}`,
        params
    );
    return { rows, total };
}

async function getById(id) {
    const [rows] = await pool.execute(
        `SELECT *, name AS title, country AS location FROM destinations WHERE id = ?`,
        [id]
    );
    return rows[0] || null;
}

async function getFeatured(limit = 6) {
    const [rows] = await pool.execute(
        `SELECT *, name AS title, country AS location FROM destinations WHERE is_featured = 1 AND is_active = 1 ORDER BY avg_rating DESC LIMIT ?`,
        [limit]
    );
    return rows;
}

async function create(data) {
    const { name, country, region, description, image_url, category, is_featured = 0 } = data;
    const [result] = await pool.execute(
        `INSERT INTO destinations (name, country, region, description, image_url, category, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name || null, country || null, region || null, description || null, image_url || null, category || null, is_featured ?? 0]
    );
    return result.insertId;
}

async function update(id, data) {
    const { name, country, region, description, image_url, category, is_featured, is_active } = data;
    const [result] = await pool.execute(
        `UPDATE destinations SET name=?, country=?, region=?, description=?, image_url=?, category=?, is_featured=?, updated_at=NOW()
     WHERE id=?`,
        [
            name || null,
            country || null,
            region || null,
            description || null,
            image_url || null,
            category || null,
            is_featured ?? 0,
            id
        ]
    );
    return result.affectedRows;
}

async function remove(id) {
    const [result] = await pool.execute(
        `UPDATE destinations SET is_active = 0 WHERE id = ?`,
        [id]
    );
    return result.affectedRows;
}

async function updateRating(id) {
    await pool.execute(
        `UPDATE destinations d
     SET d.avg_rating = (
       SELECT COALESCE(AVG(r.rating), 0) FROM reviews r WHERE r.destination_id = d.id AND r.is_approved = 1
     ),
     d.total_reviews = (
       SELECT COUNT(*) FROM reviews r WHERE r.destination_id = d.id AND r.is_approved = 1
     )
     WHERE d.id = ?`,
        [id]
    );
}

module.exports = { getAll, getById, getFeatured, create, update, remove, updateRating };
