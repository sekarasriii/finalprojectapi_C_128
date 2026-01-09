const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Route untuk membuat pesanan (memerlukan API Key)
router.post('/', apiKeyAuth, orderController.createOrder);

// Route untuk melihat daftar pesanan (memerlukan API Key dengan data_access_type: orders)
router.get('/', apiKeyAuth, orderController.getOrders);

// Route untuk mengubah status pesanan - Admin only (memerlukan API Key)
router.put('/:id/status', apiKeyAuth, orderController.updateOrderStatus);

module.exports = router;
