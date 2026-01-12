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
// UPDATE Order Status (Admin)
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validasi status
        const validStatuses = ['pending', 'approved', 'in_progress', 'completed', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid. Pilih: pending, approved, in_progress, completed, atau rejected.'
            });
        }

        const [result] = await db.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pesanan tidak ditemukan.'
            });
        }

        res.json({
            success: true,
            message: 'Status pesanan berhasil diupdate.'
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat update status pesanan.'
        });
    }
});

// GET Order Statistics (Admin)
router.get('/stats', async (req, res) => {
    try {
        // Total orders
        const [totalResult] = await db.query('SELECT COUNT(*) as total FROM orders');

        // Orders by status
        const [statusResult] = await db.query(
            `SELECT status, COUNT(*) as count 
             FROM orders 
             GROUP BY status`
        );

        // Total revenue (completed orders)
        const [revenueResult] = await db.query(
            `SELECT SUM(total_price) as total_revenue 
             FROM orders 
             WHERE status = 'completed'`
        );

        res.json({
            success: true,
            data: {
                total_orders: totalResult[0].total,
                by_status: statusResult,
                total_revenue: revenueResult[0].total_revenue || 0
            }
        });
    } catch (error) {
        console.error('Error getting order stats:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil statistik pesanan.'
        });
    }
});

module.exports = router;
