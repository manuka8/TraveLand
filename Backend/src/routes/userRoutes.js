'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/userController');

router.get('/me', authenticate, ctrl.getProfile);
router.patch('/me', authenticate, ctrl.updateProfile);
router.get('/me/wishlist', authenticate, ctrl.getWishlist);
router.post('/me/wishlist', authenticate, ctrl.addToWishlist);
router.delete('/me/wishlist/:destination_id', authenticate, ctrl.removeFromWishlist);

module.exports = router;
