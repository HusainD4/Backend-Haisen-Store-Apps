const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// ==========================================
// ENDPOINT PUBLIK (AUTH & RESET PASSWORD)
// ==========================================
router.post('/register', authController.register);
router.post('/login', authController.login);

// Endpoint Reset Password via OTP 4-Digit
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

// ==========================================
// ENDPOINT TERPROTEKSI (MEMERLUKAN TOKEN)
// ==========================================
router.post('/logout', verifyToken, authController.logout);

router.get('/profile', verifyToken, (req, res) => {
    res.json({ message: `Akses profil diizinkan`, user: req.user });
});

module.exports = router;