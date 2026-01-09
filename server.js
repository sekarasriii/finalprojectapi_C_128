const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (untuk frontend)
app.use(express.static('public'));

// Import routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Test database connection
require('./config/database');

// Routes
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Backend API System - Architecture Service with API Key',
        concept: '1 User = 1 API Key, API Key untuk akses data spesifik',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                generateKey: 'POST /api/auth/generate-key (with data_access_type)'
            },
            services: {
                getAll: 'GET /api/services (requires API Key with data_access_type=services)',
                add: 'POST /api/services (requires API Key - Admin only)'
            },
            orders: {
                create: 'POST /api/orders (requires API Key)',
                getAll: 'GET /api/orders (requires API Key with data_access_type=orders)',
                updateStatus: 'PUT /api/orders/{id}/status (requires API Key - Admin only)'
            }
        },
        data_access_types: {
            services: 'Akses ke data layanan arsitektur (Public API)',
            orders: 'Akses ke data pesanan (Local API - hanya data sendiri untuk client, semua data untuk admin)'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server'
    });
});

app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Architecture Service with API Key Authentication`);
});
