'use strict';

const destinationModel = require('../models/destinationModel');
const galleryModel = require('../models/galleryModel');

async function getAll(req, res, next) {
    try {
        const { search = '', category = '', page = 1, limit = 12 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const { rows, total } = await destinationModel.getAll({ search, category, limit: Number(limit), offset });
        console.log(`[GET /destinations] Found ${rows.length} destinations out of ${total}`);
        return res.json({ success: true, data: rows, pagination: { total, page: Number(page), limit: Number(limit) } });
    } catch (err) { next(err); }
}

async function getFeatured(req, res, next) {
    try {
        const { limit = 6 } = req.query;
        const rows = await destinationModel.getFeatured(Number(limit));
        return res.json({ success: true, data: rows });
    } catch (err) { next(err); }
}

async function getOne(req, res, next) {
    try {
        const dest = await destinationModel.getById(Number(req.params.id));
        if (!dest) return res.status(404).json({ success: false, message: 'Destination not found.' });

        // Fetch gallery
        const images = await galleryModel.getGallery('destination', dest.id);
        dest.images = images;

        return res.json({ success: true, data: dest });
    } catch (err) { next(err); }
}

async function create(req, res, next) {
    try {
        const { images, ...destData } = req.body;

        // Map frontend fields to DB fields
        const mappedData = {
            name: destData.name || destData.title,
            country: destData.country || destData.location,
            region: destData.region || null,
            description: destData.description || null,
            category: destData.category || 'Nature',
            is_featured: destData.is_featured || 0,
            image_url: null
        };

        // Ensure image_url is set to the main image or the first one
        if (images && images.length > 0) {
            const mainImg = images.find(img => img.is_main) || images[0];
            mappedData.image_url = mainImg.url;
        }

        const id = await destinationModel.create(mappedData);

        // Update gallery
        if (images) {
            await galleryModel.updateGallery('destination', id, images);
        }

        const dest = await destinationModel.getById(id);
        const gallery = await galleryModel.getGallery('destination', id);
        dest.images = gallery;

        return res.status(201).json({ success: true, message: 'Destination created.', data: dest });
    } catch (err) { next(err); }
}

async function update(req, res, next) {
    try {
        const id = Number(req.params.id);
        const { images, ...destData } = req.body;

        // Map frontend fields to DB fields
        const mappedData = {
            name: destData.name || destData.title,
            country: destData.country || destData.location,
            region: destData.region || null,
            description: destData.description || null,
            category: destData.category || 'Nature',
            is_featured: destData.is_featured || 0,
            image_url: null
        };

        // Ensure image_url is set to the main image or the first one
        if (images && images.length > 0) {
            const mainImg = images.find(img => img.is_main) || images[0];
            mappedData.image_url = mainImg.url;
        }

        const affected = await destinationModel.update(id, mappedData);
        if (!affected) return res.status(404).json({ success: false, message: 'Destination not found.' });

        // Update gallery
        if (images) {
            await galleryModel.updateGallery('destination', id, images);
        }

        const dest = await destinationModel.getById(id);
        const gallery = await galleryModel.getGallery('destination', id);
        dest.images = gallery;

        return res.json({ success: true, message: 'Destination updated.', data: dest });
    } catch (err) { next(err); }
}

async function remove(req, res, next) {
    try {
        await destinationModel.remove(Number(req.params.id));
        return res.json({ success: true, message: 'Destination removed.' });
    } catch (err) { next(err); }
}

module.exports = { getAll, getFeatured, getOne, create, update, remove };
