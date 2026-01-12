const express = require('express');
const router = express.Router();
const db = require('../config/database');
// GET All Orders (Admin)
router.get('/orders', async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT o.*, 
                    s.name as service_name, 
                    s.category,
                    u.name as client_name,
                    u.email as client_email
             FROM orders o 
             JOIN services s ON o.service_id = s.id 
             JOIN users u ON o.client_id = u.id
             ORDER BY o.created_at DESC`
        );

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error getting all orders:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data pesanan.'
        });
    }
});

// GET Order Detail (Admin - any order)
router.get('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [orders] = await db.query(
            `SELECT o.*, 
                    s.name as service_name, 
                    s.description as service_description,
                    s.category,
                    s.price as service_price,
                    u.name as client_name,
                    u.email as client_email
             FROM orders o 
             JOIN services s ON o.service_id = s.id 
             JOIN users u ON o.client_id = u.id
             WHERE o.id = ?`,
            [id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pesanan tidak ditemukan.'
            });
        }

        res.json({
            success: true,
            data: orders[0]
        });
    } catch (error) {
        console.error('Error getting order detail:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil detail pesanan.'
        });
    }
});
