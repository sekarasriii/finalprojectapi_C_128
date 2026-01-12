const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validateApiKey } = require('../middleware/auth');

// Semua route memerlukan API Key (client only)
router.use(validateApiKey);
