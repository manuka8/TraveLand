'use strict';

const userModel = require('../models/userModel');

async function getProfile(req, res, next) {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        return res.json({ success: true, data: user });
    } catch (err) { next(err); }
}

async function updateProfile(req, res, next) {
    try {
        const { full_name, phone, avatar_url } = req.body;
        await userModel.updateUser(req.user.id, { full_name, phone, avatar_url });
        const updated = await userModel.findById(req.user.id);
        return res.json({ success: true, message: 'Profile updated.', data: updated });
    } catch (err) { next(err); }
}

// --- Wishlist ---
async function getWishlist(req, res, next) {
    try {
        const items = await userModel.getWishlist(req.user.id);
        return res.json({ success: true, data: items });
    } catch (err) { next(err); }
}

async function addToWishlist(req, res, next) {
    try {
        const { destination_id } = req.body;
        if (!destination_id) return res.status(400).json({ success: false, message: 'destination_id required.' });
        await userModel.addToWishlist(req.user.id, destination_id);
        return res.json({ success: true, message: 'Added to wishlist.' });
    } catch (err) { next(err); }
}

async function removeFromWishlist(req, res, next) {
    try {
        const { destination_id } = req.params;
        await userModel.removeFromWishlist(req.user.id, destination_id);
        return res.json({ success: true, message: 'Removed from wishlist.' });
    } catch (err) { next(err); }
}

module.exports = { getProfile, updateProfile, getWishlist, addToWishlist, removeFromWishlist };
