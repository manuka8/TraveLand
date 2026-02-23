'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const ctrl = require('../controllers/packageController');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

router.post('/', authenticate, authorize('admin'), ctrl.create);
router.put('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
