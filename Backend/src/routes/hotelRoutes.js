'use strict';

const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', hotelController.getHotels);
router.get('/:id', hotelController.getHotel);

// Protected Admin Routes
router.use(authenticate);
router.use(authorize('admin'));

router.post('/', hotelController.createHotel);
router.put('/:id', hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

module.exports = router;
