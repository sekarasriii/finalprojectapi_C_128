const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { validateApiKey } = require('../middleware/auth');

// Semua route memerlukan API Key (client only)
router.use(validateApiKey);
// CREATE Order (Client)
router.post('/', async (req, res) => {
    try {
        const { service_id, notes } = req.body;
        const client_id = req.user.id; // Dari middleware validateApiKey

        // Validasi input
        if (!service_id) {
            return res.status(400).json({
                success: false,
                message: 'Service ID harus diisi.'
            });
        }

        // Cek apakah service exists dan active
        const [services] = await db.query(
            'SELECT id, name, price FROM services WHERE id = ? AND is_active = TRUE',
            [service_id]
        );

        if (services.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Layanan tidak ditemukan atau tidak aktif.'
            });
        }

        const service = services[0];
        const total_price = service.price;

        // Insert order
        const [result] = await db.query(
            'INSERT INTO orders (client_id, service_id, notes, total_price) VALUES (?, ?, ?, ?)',
            [client_id, service_id, notes || null, total_price]
        );

        res.status(201).json({
            success: true,
            message: 'Pesanan berhasil dibuat.',
            data: {
                id: result.insertId,
                service_name: service.name,
                total_price: total_price,
                status: 'pending'
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat pesanan.'
        });
    }
});

