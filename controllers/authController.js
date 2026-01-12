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
