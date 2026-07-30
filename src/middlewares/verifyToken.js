const jwt = require('jsonwebtoken');
const Logger = require('../utils/logger');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan' });
    }

    try {
        // Ganti 'process.env.JWT_SECRET' dengan secret key yang Anda gunakan saat login
        const secret = process.env.JWT_SECRET || 'YOUR_JWT_SECRET_KEY';
        const decoded = jwt.verify(token, secret);
        
        req.user = decoded; // Menyimpan data payload user ke req.user
        next();
    } catch (error) {
        Logger.error('Token Verification Error:', error.message);
        return res.status(403).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
    }
};

module.exports = verifyToken;