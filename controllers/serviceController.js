const db = require('../config/database');

// Get All Services - Public API
const getServices = async (req, res) => {
    try {
        // Cek data access type
        if (req.user.dataAccessType !== 'services') {
            return res.status(403).json({
                success: false,
                message: 'API Key Anda tidak memiliki akses ke data layanan. Generate API Key dengan data_access_type: services'
            });
        }

        const [services] = await db.query(
            'SELECT * FROM services ORDER BY created_at DESC'
        );

        res.status(200).json({
            success: true,
            message: 'Daftar layanan arsitektur',
            access_info: {
                user: req.user.name,
                access_type: req.user.dataAccessType
            },
            total: services.length,
            data: services
        });
    } catch (error) {
        console.error('Error in getServices:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data layanan'
        });
    }
};

// Add New Service (Admin Only)
const addService = async (req, res) => {
    try {
        // Cek apakah user adalah admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Hanya admin yang dapat menambah layanan'
            });
        }

        const { service_name, description, price } = req.body;

        // Validasi input
        if (!service_name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Service name dan price harus diisi'
            });
        }

        // Validasi price
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price harus berupa angka positif'
            });
        }

        // Insert service baru
        const [result] = await db.query(
            'INSERT INTO services (service_name, description, price) VALUES (?, ?, ?)',
            [service_name, description || null, price]
        );

        res.status(201).json({
            success: true,
            message: 'Layanan berhasil ditambahkan',
            data: {
                service_id: result.insertId,
                service_name,
                description,
                price: parseFloat(price)
            }
        });
    } catch (error) {
        console.error('Error in addService:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menambah layanan'
        });
    }
};

module.exports = {
    getServices,
    addService
};
