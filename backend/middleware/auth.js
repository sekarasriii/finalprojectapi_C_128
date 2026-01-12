const db = require('../config/database');

// Middleware untuk validasi API Key
async function validateApiKey(req, res, next) {
    try {
        // Ambil API Key dari header
        const apiKey = req.headers['x-api-key'];

        // Cek apakah API Key ada
        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: 'API Key diperlukan. Sertakan x-api-key di header request.'
            });
        }
