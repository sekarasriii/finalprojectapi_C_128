const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/database');

// Fungsi untuk generate API Key unik
function generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
}

// POST /api/apikey/generate - Generate API Key baru
router.post('/generate', async (req, res) => {
    try {
        const { user_id } = req.body;

        // Validasi input
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID diperlukan.'
            });
        }

        // Cek apakah user ada
        const [users] = await db.query(
            'SELECT id FROM users WHERE id = ?',
            [user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan.'
            });
        }

        // Nonaktifkan API Key lama (satu user hanya punya satu API Key aktif)
        await db.query(
            'UPDATE api_keys SET is_active = FALSE WHERE user_id = ?',
            [user_id]
        );

        // Generate API Key baru
        const newApiKey = generateApiKey();

        // Insert API Key baru
        const [result] = await db.query(
            'INSERT INTO api_keys (user_id, api_key) VALUES (?, ?)',
            [user_id, newApiKey]
        );

        res.status(201).json({
            success: true,
            message: 'API Key berhasil di-generate.',
            data: {
                id: result.insertId,
                api_key: newApiKey,
                user_id: user_id
            }
        });
    } catch (error) {
        console.error('Error generating API Key:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat generate API Key.'
        });
    }
});
