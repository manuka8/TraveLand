'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const userModel = require('../models/userModel');
const { validate } = require('../middleware/validate');

// Validation rules
const registerRules = [
    body('full_name').trim().notEmpty().withMessage('Full name is required.'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];

const loginRules = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
];

function signToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
}

async function register(req, res, next) {
    try {
        const { full_name, email, password, phone } = req.body;

        const existing = await userModel.findByEmail(email);
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already in use.' });
        }

        const password_hash = await bcrypt.hash(password, 12);
        const id = await userModel.createUser({ full_name, email, password_hash, phone });

        const user = await userModel.findById(id);
        const token = signToken(user);

        return res.status(201).json({
            success: true,
            message: 'Registration successful.',
            data: { token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } },
        });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = signToken(user);

        return res.json({
            success: true,
            message: 'Login successful.',
            data: { token, user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role } },
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { register, login, registerRules, loginRules, validate };
