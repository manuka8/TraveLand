'use strict';

const { pool } = require('../config/db');

async function create({ user_id, package_id, guests, travel_date, return_date, total_price, notes }) {
    const [result] = await pool.execute(
        `INSERT INTO bookings (user_id, package_id, guests, travel_date, return_date, total_price, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, package_id, guests, travel_date, return_date || null, total_price, notes || null]
    );
    return result.insertId;
}

async function findById(id) {
    const [rows] = await pool.execute(
        `SELECT b.*, p.title AS package_title, p.price_per_person,
            d.name AS destination_name, d.country,
            u.full_name AS user_name, u.email AS user_email
     FROM bookings b
     JOIN packages p ON p.id = b.package_id
     JOIN destinations d ON d.id = p.destination_id
     JOIN users u ON u.id = b.user_id
     WHERE b.id = ? LIMIT 1`,
        [id]
    );
    return rows[0] || null;
}

async function getUserBookings(user_id, { limit = 20, offset = 0 }) {
    const [rows] = await pool.execute(
        `SELECT b.*, p.title AS package_title, d.name AS destination_name, d.country, d.image_url AS destination_image
     FROM bookings b
     JOIN packages p ON p.id = b.package_id
     JOIN destinations d ON d.id = p.destination_id
     WHERE b.user_id = ?
     ORDER BY b.created_at DESC LIMIT ? OFFSET ?`,
        [user_id, limit, offset]
    );
    const [[{ total }]] = await pool.execute(
        `SELECT COUNT(*) AS total FROM bookings WHERE user_id = ?`, [user_id]
    );
    return { rows, total };
}

async function updateStatus(id, status) {
    const [result] = await pool.execute(
        `UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?`, [status, id]
    );
    return result.affectedRows;
}

async function getAllBookings({ limit = 20, offset = 0, status }) {
    let where = '';
    const params = [];
    if (status) {
        where = 'WHERE b.status = ?';
        params.push(status);
    }
    const [rows] = await pool.execute(
        `SELECT b.*, p.title AS package_title, d.name AS destination_name, u.full_name AS user_name, u.email AS user_email
     FROM bookings b
     JOIN packages p ON p.id = b.package_id
     JOIN destinations d ON d.id = p.destination_id
     JOIN users u ON u.id = b.user_id
     ${where} ORDER BY b.created_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );
    const [[{ total }]] = await pool.execute(
        `SELECT COUNT(*) AS total FROM bookings b ${where}`, params
    );
    return { rows, total };
}

async function getStats() {
    const [[stats]] = await pool.execute(
        `SELECT
       COUNT(*) AS total_bookings,
       SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed,
       SUM(CASE WHEN status = 'pending'   THEN 1 ELSE 0 END) AS pending,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
       SUM(total_price) AS total_revenue
     FROM bookings`
    );
    return stats;
}

module.exports = { create, findById, getUserBookings, updateStatus, getAllBookings, getStats };
