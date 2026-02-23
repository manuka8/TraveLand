'use strict';

const { pool } = require('../config/db');

async function create({ destination_id, user_id, rating, title, body }) {
    const [result] = await pool.execute(
        `INSERT INTO reviews (destination_id, user_id, rating, title, body)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE rating=VALUES(rating), title=VALUES(title), body=VALUES(body), updated_at=NOW()`,
        [destination_id, user_id, rating, title || null, body || null]
    );
    return result.insertId || result.warningStatus;
}

async function getByDestination(destination_id, { limit = 20, offset = 0 }) {
    const [rows] = await pool.execute(
        `SELECT r.*, u.full_name AS user_name, u.avatar_url
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.destination_id = ? AND r.is_approved = 1
     ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
        [destination_id, limit, offset]
    );
    const [[{ total }]] = await pool.execute(
        `SELECT COUNT(*) AS total FROM reviews WHERE destination_id = ? AND is_approved = 1`,
        [destination_id]
    );
    return { rows, total };
}

async function getAll({ limit = 20, offset = 0 }) {
    const [rows] = await pool.execute(
        `SELECT r.*, u.full_name AS user_name, d.name AS destination_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     JOIN destinations d ON d.id = r.destination_id
     ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    const [[{ total }]] = await pool.execute(`SELECT COUNT(*) AS total FROM reviews`);
    return { rows, total };
}

module.exports = { create, getByDestination, getAll };
