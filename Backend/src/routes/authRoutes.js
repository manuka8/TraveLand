'use strict';

const router = require('express').Router();
const { register, login, registerRules, loginRules, validate } = require('../controllers/authController');
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

router.post('/upload', authenticate, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No image uploaded'
        });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.json({
        success: true,
        data: {
            url: imageUrl,
            filename: req.file.filename
        }
    });
});

module.exports = router;
