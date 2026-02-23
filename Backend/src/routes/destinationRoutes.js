'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const ctrl = require('../controllers/destinationController');

// Public
router.get('/', ctrl.getAll);
router.get('/featured', ctrl.getFeatured);
router.get('/:id', ctrl.getOne);

// Admin only
router.post('/', authenticate, authorize('admin'), ctrl.create);
router.put('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
