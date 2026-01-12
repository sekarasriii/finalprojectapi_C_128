const db = require('../config/database');
const crypto = require('crypto');

// Register User Baru
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validasi input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, dan password harus diisi'
            });
        }

        // Validasi role
        const userRole = role || 'client';
        if (!['admin', 'client'].includes(userRole)) {
            return res.status(400).json({
                success: false,
                message: 'Role harus admin atau client'
            });
        }

        // Cek apakah email sudah ada
        const [existing] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        // Insert user baru
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, userRole]
        );

        res.status(201).json({
            success: true,
            message: 'User berhasil didaftarkan',
            data: {
                user_id: result.insertId,
                name,
                email,
                role: userRole
            }
        });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat registrasi'
        });
    }
};
// Generate API Key dengan data access type
const generateApiKey = async (req, res) => {
    try {
        const { email, password, data_access_type } = req.body;

        // Validasi input
        if (!email || !password || !data_access_type) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, dan data_access_type harus diisi'
            });
        }

        // Validasi user credentials
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        const userId = users[0].user_id;

        // Nonaktifkan semua API Key lama user ini
        await db.query(
            'UPDATE api_keys SET is_active = FALSE WHERE user_id = ?',
            [userId]
        );

        // Generate API Key baru
        const newApiKey = crypto.randomBytes(32).toString('hex');

        // Insert API Key baru
        await db.query(
            'INSERT INTO api_keys (user_id, api_key, data_access_type, is_active) VALUES (?, ?, ?, TRUE)',
            [userId, newApiKey, data_access_type]
        );

        res.status(201).json({
            success: true,
            message: 'API Key berhasil di-generate',
            data: {
                api_key: newApiKey,
                data_access_type: data_access_type,
                user: {
                    user_id: userId,
                    name: users[0].name,
                    email: users[0].email,
                    role: users[0].role
                }
            }
        });
    } catch (error) {
        console.error('Error in generateApiKey:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat generate API Key'
        });
    }
};

module.exports = {
    register,
    generateApiKey
};