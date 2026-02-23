'use strict';

const reviewModel = require('../models/reviewModel');
const destinationModel = require('../models/destinationModel');

async function createReview(req, res, next) {
    try {
        const { destination_id, rating, title, body } = req.body;
        const dest = await destinationModel.getById(Number(destination_id));
        if (!dest) return res.status(404).json({ success: false, message: 'Destination not found.' });

        await reviewModel.create({ destination_id: Number(destination_id), user_id: req.user.id, rating, title, body });
        await destinationModel.updateRating(Number(destination_id));

        return res.status(201).json({ success: true, message: 'Review submitted.' });
    } catch (err) { next(err); }
}

async function getReviewsByDestination(req, res, next) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const { rows, total } = await reviewModel.getByDestination(Number(req.params.destination_id), { limit: Number(limit), offset });
        return res.json({ success: true, data: rows, pagination: { total, page: Number(page), limit: Number(limit) } });
    } catch (err) { next(err); }
}

async function getAllReviews(req, res, next) {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const { rows, total } = await reviewModel.getAll({ limit: Number(limit), offset });
        return res.json({ success: true, data: rows, pagination: { total, page: Number(page), limit: Number(limit) } });
    } catch (err) { next(err); }
}

module.exports = { createReview, getReviewsByDestination, getAllReviews };
