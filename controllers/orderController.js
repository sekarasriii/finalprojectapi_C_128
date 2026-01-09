const db = require('../config/database');

// Create Order
const createOrder = async (req, res) => {
    try {
        const { service_id } = req.body;
        const userId = req.user.id;

        // Validasi input
        if (!service_id) {
            return res.status(400).json({
                success: false,
                message: 'Service ID harus diisi'
            });
        }

        // Cek apakah service ada
        const [services] = await db.query(
            'SELECT * FROM services WHERE service_id = ?',
            [service_id]
        );

        if (services.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Layanan tidak ditemukan'
            });
        }

        // Insert order baru
        const [result] = await db.query(
            'INSERT INTO orders (user_id, service_id, status) VALUES (?, ?, ?)',
            [userId, service_id, 'pending']
        );

        res.status(201).json({
            success: true,
            message: 'Pesanan berhasil dibuat',
            data: {
                order_id: result.insertId,
                user_id: userId,
                service_id: service_id,
                service_name: services[0].service_name,
                price: services[0].price,
                status: 'pending'
            }
        });
    } catch (error) {
        console.error('Error in createOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat membuat pesanan'
        });
    }
};

// Get Orders - Local API (hanya data user sendiri)
const getOrders = async (req, res) => {
    try {
        // Cek data access type
        if (req.user.dataAccessType !== 'orders') {
            return res.status(403).json({
                success: false,
                message: 'API Key Anda tidak memiliki akses ke data pesanan. Generate API Key dengan data_access_type: orders'
            });
        }

        const userId = req.user.id;
        const userRole = req.user.role;

        let query;
        let params;

        // Jika admin, tampilkan semua order
        // Jika client, tampilkan order miliknya saja
        if (userRole === 'admin') {
            query = `
                SELECT o.*, u.name as user_name, u.email, s.service_name, s.price
                FROM orders o
                JOIN users u ON o.user_id = u.user_id
                JOIN services s ON o.service_id = s.service_id
                ORDER BY o.order_date DESC
            `;
            params = [];
        } else {
            query = `
                SELECT o.*, s.service_name, s.price
                FROM orders o
                JOIN services s ON o.service_id = s.service_id
                WHERE o.user_id = ?
                ORDER BY o.order_date DESC
            `;
            params = [userId];
        }

        const [orders] = await db.query(query, params);

        res.status(200).json({
            success: true,
            message: userRole === 'admin' ? 'Semua pesanan' : 'Pesanan Anda',
            access_info: {
                user: req.user.name,
                role: userRole,
                access_type: req.user.dataAccessType
            },
            total: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error in getOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data pesanan'
        });
    }
};

// Update Order Status (Admin Only)
const updateOrderStatus = async (req, res) => {
    try {
        // Cek apakah user adalah admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Hanya admin yang dapat mengubah status pesanan'
            });
        }

        const { id } = req.params;
        const { status } = req.body;

        // Validasi status
        const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status harus salah satu dari: pending, processing, completed, cancelled'
            });
        }

        // Cek apakah order ada
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE order_id = ?',
            [id]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pesanan tidak ditemukan'
            });
        }

        // Update status
        await db.query(
            'UPDATE orders SET status = ? WHERE order_id = ?',
            [status, id]
        );

        res.status(200).json({
            success: true,
            message: 'Status pesanan berhasil diubah',
            data: {
                order_id: parseInt(id),
                status: status
            }
        });
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengubah status pesanan'
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
};
