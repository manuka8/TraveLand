'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/paymentController');

router.post('/', authenticate, ctrl.initiatePayment);
router.get('/my', authenticate, ctrl.getMyPayments);
router.get('/booking/:booking_id', authenticate, ctrl.getPaymentsByBooking);

module.exports = router;
