'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/reviewController');

router.post('/', authenticate, ctrl.createReview);
router.get('/destination/:destination_id', ctrl.getReviewsByDestination);

module.exports = router;
