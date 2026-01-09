const db = require('../config/database');

// Middleware untuk validasi API Key
const apiKeyAuth = async (req, res, next) => {
    try {
        // Ambil API Key dari header
        const apiKey = req.headers['x-api-key'];

        // Cek apakah API Key ada
        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: 'API Key tidak ditemukan. Gunakan header x-api-key'
            });
        }

        // Query untuk validasi API Key
        const [rows] = await db.query(
            `SELECT ak.*, u.user_id, u.name, u.email, u.role 
             FROM api_keys ak 
             JOIN users u ON ak.user_id = u.user_id 
             WHERE ak.api_key = ? AND ak.is_active = TRUE`,
            [apiKey]
        );

        // Cek apakah API Key valid
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'API Key tidak valid atau sudah tidak aktif'
            });
        }

        // Simpan informasi user ke request object
        req.user = {
            id: rows[0].user_id,
            name: rows[0].name,
            email: rows[0].email,
            role: rows[0].role,
            dataAccessType: rows[0].data_access_type
        };

        next();
    } catch (error) {
        console.error('Error in API Key authentication:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat validasi API Key'
        });
    }
};

module.exports = apiKeyAuth;
