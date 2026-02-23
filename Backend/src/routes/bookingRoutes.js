'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/bookingController');

router.post('/', authenticate, ctrl.createBooking);
router.get('/my', authenticate, ctrl.getMyBookings);
router.get('/:id', authenticate, ctrl.getBookingById);
router.patch('/:id/cancel', authenticate, ctrl.cancelBooking);

module.exports = router;
