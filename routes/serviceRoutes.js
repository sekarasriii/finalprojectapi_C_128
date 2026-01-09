const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Route untuk melihat daftar layanan (memerlukan API Key dengan data_access_type: services)
router.get('/', apiKeyAuth, serviceController.getServices);

// Route untuk menambah layanan - Admin only (memerlukan API Key)
router.post('/', apiKeyAuth, serviceController.addService);

module.exports = router;
