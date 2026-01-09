const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route untuk registrasi user
router.post('/register', authController.register);

// Route untuk generate API Key
router.post('/generate-key', authController.generateApiKey);

module.exports = router;
