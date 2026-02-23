'use strict';

const hotelModel = require('../models/hotelModel');
const galleryModel = require('../models/galleryModel');

// @desc    Get all hotels
// @route   GET /api/hotels
exports.getHotels = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { rows, total } = await hotelModel.getAllHotels({
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            count: rows.length,
            total,
            data: rows
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
exports.getHotel = async (req, res, next) => {
    try {
        const hotel = await hotelModel.getById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }

        // Fetch gallery
        const images = await galleryModel.getGallery('hotel', hotel.id);
        hotel.images = images;

        res.json({ success: true, data: hotel });
    } catch (err) {
        next(err);
    }
};

// @desc    Create hotel (Admin only)
// @route   POST /api/hotels
exports.createHotel = async (req, res, next) => {
    try {
        const { images, ...hotelData } = req.body;

        // Ensure image_url is set to the main image or the first one
        if (images && images.length > 0) {
            const mainImg = images.find(img => img.is_main) || images[0];
            hotelData.image_url = mainImg.url;
        }

        const hotelId = await hotelModel.createHotel(hotelData);

        // Update gallery
        if (images) {
            await galleryModel.updateGallery('hotel', hotelId, images);
        }

        const hotel = await hotelModel.getById(hotelId);
        const gallery = await galleryModel.getGallery('hotel', hotelId);
        hotel.images = gallery;

        res.status(201).json({ success: true, data: hotel });
    } catch (err) {
        next(err);
    }
};

// @desc    Update hotel (Admin only)
// @route   PUT /api/hotels/:id
exports.updateHotel = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { images, ...hotelData } = req.body;

        // Ensure image_url is set to the main image or the first one
        if (images && images.length > 0) {
            const mainImg = images.find(img => img.is_main) || images[0];
            hotelData.image_url = mainImg.url;
        }

        const affected = await hotelModel.updateHotel(id, hotelData);
        if (affected === 0) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }

        // Update gallery
        if (images) {
            await galleryModel.updateGallery('hotel', id, images);
        }

        const hotel = await hotelModel.getById(id);
        const gallery = await galleryModel.getGallery('hotel', id);
        hotel.images = gallery;

        res.json({ success: true, data: hotel });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete hotel (Admin only)
// @route   DELETE /api/hotels/:id
exports.deleteHotel = async (req, res, next) => {
    try {
        const affected = await hotelModel.deleteHotel(req.params.id);
        if (affected === 0) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }
        res.json({ success: true, message: 'Hotel deleted successfully' });
    } catch (err) {
        next(err);
    }
};
