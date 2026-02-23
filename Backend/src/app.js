'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const hotelRoutes = require('./routes/hotelRoutes');

const app = express();

// Request logger for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ──── CORS ───────────────────────────────────────────────────────────────────
app.use(cors({
    origin: (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:5174')
        .split(',')
        .map(url => url.trim()),
    credentials: true,
}));

// ──── Body Parsers ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ──── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
    res.json({ success: true, message: 'TraveLand API is running' })
);

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ──── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hotels', hotelRoutes);

console.log('  ✔ API routes initialized');

// ──── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// ──── Global error handler ────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
