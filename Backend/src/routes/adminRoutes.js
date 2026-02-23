'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const ctrl = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/stats', ctrl.getDashboardStats);

// Users
router.get('/users', ctrl.getUsers);
router.patch('/users/:id/toggle', ctrl.toggleUser);

// Bookings
router.get('/bookings', ctrl.getAllBookings);
router.patch('/bookings/:id/status', ctrl.updateBookingStatus);

// Reviews (forwarded from reviewController)
const reviewCtrl = require('../controllers/reviewController');
router.get('/reviews', reviewCtrl.getAllReviews);

module.exports = router;
