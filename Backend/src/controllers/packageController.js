'use strict';

const packageModel = require('../models/packageModel');
const galleryModel = require('../models/galleryModel');

async function getAll(req, res, next) {
    try {
        const { destination_id, min_price, max_price, page = 1, limit = 12 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const { rows, total } = await packageModel.getAll({
            destination_id: destination_id ? Number(destination_id) : undefined,
            min_price: min_price != null ? Number(min_price) : undefined,
            max_price: max_price != null ? Number(max_price) : undefined,
            limit: Number(limit), offset,
        });
        return res.json({ success: true, data: rows, pagination: { total, page: Number(page), limit: Number(limit) } });
    } catch (err) { next(err); }
}

async function getOne(req, res, next) {
    try {
        const pkg = await packageModel.getById(Number(req.params.id));
        if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });

        // Fetch gallery
        const images = await galleryModel.getGallery('package', pkg.id);
        pkg.images = images;

        return res.json({ success: true, data: pkg });
    } catch (err) { next(err); }
}

async function create(req, res, next) {
    try {
        const { images, ...pkgData } = req.body;

        // Map frontend fields to DB fields
        const mappedData = {
            destination_id: pkgData.destination_id || 1, // Default or find first
            title: pkgData.title,
            description: pkgData.description || null,
            duration_days: pkgData.duration_days || pkgData.duration,
            price_per_person: pkgData.price_per_person || pkgData.price,
            is_available: pkgData.is_available ?? 1,
            image_url: null
        };

        // Ensure image_url is set to the main image or the first one
        if (images && images.length > 0) {
            const mainImg = images.find(img => img.is_main) || images[0];
            mappedData.image_url = mainImg.url;
        }

        const id = await packageModel.create(mappedData);

        // Update gallery
        if (images) {
            await galleryModel.updateGallery('package', id, images);
        }

        const pkg = await packageModel.getById(id);
        const gallery = await galleryModel.getGallery('package', id);
        pkg.images = gallery;

        return res.status(201).json({ success: true, message: 'Package created.', data: pkg });
    } catch (err) { next(err); }
}

async function update(req, res, next) {
    try {
        const id = Number(req.params.id);
        const { images, ...pkgData } = req.body;

        // Map frontend fields to DB fields
        const mappedData = {
            destination_id: pkgData.destination_id,
            title: pkgData.title,
            description: pkgData.description,
            duration_days: pkgData.duration_days || pkgData.duration,
            price_per_person: pkgData.price_per_person || pkgData.price,
            is_available: pkgData.is_available,
            image_url: null
        };

        // Ensure image_url is set to the main image or the first one
        if (images && images.length > 0) {
            const mainImg = images.find(img => img.is_main) || images[0];
            mappedData.image_url = mainImg.url;
        }

        const affected = await packageModel.update(id, mappedData);
        if (!affected) return res.status(404).json({ success: false, message: 'Package not found.' });

        // Update gallery
        if (images) {
            await galleryModel.updateGallery('package', id, images);
        }

        const pkg = await packageModel.getById(id);
        const gallery = await galleryModel.getGallery('package', id);
        pkg.images = gallery;

        return res.json({ success: true, message: 'Package updated.', data: pkg });
    } catch (err) { next(err); }
}

async function remove(req, res, next) {
    try {
        await packageModel.remove(Number(req.params.id));
        return res.json({ success: true, message: 'Package removed.' });
    } catch (err) { next(err); }
}

module.exports = { getAll, getOne, create, update, remove };
