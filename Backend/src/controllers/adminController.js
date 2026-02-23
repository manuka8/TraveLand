'use strict';

const userModel = require('../models/userModel');
const bookingModel = require('../models/bookingModel');
const destinationModel = require('../models/destinationModel');
const { pool } = require('../config/db');

async function getDashboardStats(req, res, next) {
    try {
        // Basic Counts
        const [[{ total: users }]] = await pool.execute('SELECT COUNT(*) AS total FROM users');
        const [[{ total: bookings }]] = await pool.execute('SELECT COUNT(*) AS total FROM bookings');
        const [[{ total: destinations }]] = await pool.execute('SELECT COUNT(*) AS total FROM destinations WHERE is_active = 1');
        const [[{ total: packages }]] = await pool.execute('SELECT COUNT(*) AS total FROM packages WHERE is_active = 1');
        const [[{ total: hotels }]] = await pool.execute('SELECT COUNT(*) AS total FROM hotels WHERE is_active = 1');
        const [[{ total: revenue }]] = await pool.execute('SELECT SUM(amount) AS total FROM payments WHERE status = "completed"');

        // Revenue Trend (Last 6 Months)
        const [revenueTrend] = await pool.execute(`
            SELECT 
                DATE_FORMAT(payment_date, '%b') as month,
                SUM(amount) as amount
            FROM payments 
            WHERE status = "completed" 
            AND payment_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY month
            ORDER BY MIN(payment_date)
        `);

        // Booking status distribution
        const [bookingStatus] = await pool.execute(`
            SELECT status, COUNT(*) as count 
            FROM bookings 
            GROUP BY status
        `);

        // Destination categories (popularity)
        const [categoryDistribution] = await pool.execute(`
            SELECT category, COUNT(*) as count 
            FROM destinations 
            GROUP BY category
        `);

        res.json({
            success: true,
            data: {
                counts: {
                    users, bookings, destinations, packages, hotels,
                    revenue: revenue || 0
                },
                revenueTrend,
                bookingStatus,
                categoryDistribution
            }
        });
    } catch (err) { next(err); }
}

// Users
async function getUsers(req, res, next) {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const { rows, total } = await userModel.getAllUsers({ limit: Number(limit), offset });
        return res.json({ success: true, data: rows, pagination: { total, page: Number(page), limit: Number(limit) } });
    } catch (err) { next(err); }
}

async function toggleUser(req, res, next) {
    try {
        const { is_active } = req.body;
        await userModel.toggleUserActive(Number(req.params.id), is_active ? 1 : 0);
        return res.json({ success: true, message: `User ${is_active ? 'activated' : 'deactivated'}.` });
    } catch (err) { next(err); }
}

// Bookings
async function getAllBookings(req, res, next) {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const { rows, total } = await bookingModel.getAllBookings({ limit: Number(limit), offset, status });
        return res.json({ success: true, data: rows, pagination: { total, page: Number(page), limit: Number(limit) } });
    } catch (err) { next(err); }
}

async function updateBookingStatus(req, res, next) {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status.' });
        }
        await bookingModel.updateStatus(Number(req.params.id), status);
        return res.json({ success: true, message: 'Booking status updated.' });
    } catch (err) { next(err); }
}

module.exports = { getDashboardStats, getUsers, toggleUser, getAllBookings, updateBookingStatus };
