'use strict';

const { pool } = require('../config/db');

async function create({ booking_id, user_id, amount, currency = 'USD', method, transaction_id }) {
    const [result] = await pool.execute(
        `INSERT INTO payments (booking_id, user_id, amount, currency, method, transaction_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [booking_id, user_id, amount, currency, method || null, transaction_id || null]
    );
    return result.insertId;
}

async function updateStatus(id, status, paid_at = null) {
    const [result] = await pool.execute(
        `UPDATE payments SET status = ?, paid_at = ? WHERE id = ?`,
        [status, paid_at || null, id]
    );
    return result.affectedRows;
}

async function getByBookingId(booking_id) {
    const [rows] = await pool.execute(
        `SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC`,
        [booking_id]
    );
    return rows;
}

async function getUserPayments(user_id, { limit = 20, offset = 0 }) {
    const [rows] = await pool.execute(
        `SELECT pay.*, b.travel_date, p.title AS package_title
     FROM payments pay
     JOIN bookings b ON b.id = pay.booking_id
     JOIN packages p ON p.id = b.package_id
     WHERE pay.user_id = ?
     ORDER BY pay.created_at DESC LIMIT ? OFFSET ?`,
        [user_id, limit, offset]
    );
    const [[{ total }]] = await pool.execute(
        `SELECT COUNT(*) AS total FROM payments WHERE user_id = ?`, [user_id]
    );
    return { rows, total };
}

module.exports = { create, updateStatus, getByBookingId, getUserPayments };
