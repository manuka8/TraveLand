'use strict';

const paymentModel = require('../models/paymentModel');
const bookingModel = require('../models/bookingModel');

async function initiatePayment(req, res, next) {
    try {
        const { booking_id, method = 'card' } = req.body;

        const booking = await bookingModel.findById(Number(booking_id));
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

        // Simulate payment processing (replace with real gateway in production)
        const transaction_id = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        const payment_id = await paymentModel.create({
            booking_id: Number(booking_id),
            user_id: req.user.id,
            amount: booking.total_price,
            method,
            transaction_id,
        });

        // Mark payment as completed & booking as confirmed
        await paymentModel.updateStatus(payment_id, 'completed', new Date());
        await bookingModel.updateStatus(Number(booking_id), 'confirmed');

        return res.json({
            success: true,
            message: 'Payment processed successfully.',
            data: { payment_id, transaction_id, status: 'completed' },
        });
    } catch (err) { next(err); }
}

async function getMyPayments(req, res, next) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const { rows, total } = await paymentModel.getUserPayments(req.user.id, { limit: Number(limit), offset });
        return res.json({ success: true, data: rows, pagination: { total, page: Number(page), limit: Number(limit) } });
    } catch (err) { next(err); }
}

async function getPaymentsByBooking(req, res, next) {
    try {
        const rows = await paymentModel.getByBookingId(Number(req.params.booking_id));
        return res.json({ success: true, data: rows });
    } catch (err) { next(err); }
}

module.exports = { initiatePayment, getMyPayments, getPaymentsByBooking };
