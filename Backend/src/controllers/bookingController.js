'use strict';

const bookingModel = require('../models/bookingModel');
const packageModel = require('../models/packageModel');
const paymentModel = require('../models/paymentModel');

async function createBooking(req, res, next) {
    try {
        const { package_id, guests = 1, travel_date, return_date, notes } = req.body;

        const pkg = await packageModel.getById(package_id);
        if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });

        const total_price = pkg.price_per_person * Number(guests);

        const booking_id = await bookingModel.create({
            user_id: req.user.id,
            package_id,
            guests: Number(guests),
            travel_date,
            return_date,
            total_price,
            notes,
        });

        // Auto-create pending payment record
        await paymentModel.create({
            booking_id,
            user_id: req.user.id,
            amount: total_price,
        });

        const booking = await bookingModel.findById(booking_id);
        return res.status(201).json({ success: true, message: 'Booking created.', data: booking });
    } catch (err) { next(err); }
}

async function getMyBookings(req, res, next) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const { rows, total } = await bookingModel.getUserBookings(req.user.id, { limit: Number(limit), offset });
        return res.json({ success: true, data: rows, pagination: { total, page: Number(page), limit: Number(limit) } });
    } catch (err) { next(err); }
}

async function getBookingById(req, res, next) {
    try {
        const booking = await bookingModel.findById(Number(req.params.id));
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
        if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }
        return res.json({ success: true, data: booking });
    } catch (err) { next(err); }
}

async function cancelBooking(req, res, next) {
    try {
        const booking = await bookingModel.findById(Number(req.params.id));
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });
        if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
        }
        await bookingModel.updateStatus(booking.id, 'cancelled');
        return res.json({ success: true, message: 'Booking cancelled.' });
    } catch (err) { next(err); }
}

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking };
