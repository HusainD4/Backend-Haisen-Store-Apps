const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/auth'); // Pastikan path ini sesuai dengan middleware Anda

// Terapkan middleware verifyToken ke semua route di bawah ini
router.use(verifyToken);

// Mengambil semua notifikasi
router.get('/', notificationController.getMyNotifications);

// Tandai semua notifikasi telah dibaca
router.put('/read-all', notificationController.markAllAsRead);

// Tandai satu notifikasi telah dibaca berdasarkan ID
router.put('/:id/read', notificationController.markAsRead);
// Tambahkan baris ini HAPALAN DI ATAS router.put('/:id/read', ...)
router.get('/unread-count', notificationController.getUnreadCount);
module.exports = router;