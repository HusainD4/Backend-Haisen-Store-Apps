const notificationService = require('../services/notificationService');
const Logger = require('../utils/logger');

class NotificationController {
    // GET /api/.../notifications
    async getMyNotifications(req, res) {
        try {
            const userId = req.user.id; // Didapat dari middleware verifyToken
            const notifications = await notificationService.getUserNotifications(userId);
            
            // Hitung jumlah yang belum dibaca (unread count)
            const unreadCount = notifications.filter(n => !n.is_read).length;

            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil notifikasi',
                data: notifications,
                unread_count: unreadCount
            });
        } catch (error) {
            Logger.error('Controller getMyNotifications:', error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // PUT /api/.../notifications/:id/read
    async markAsRead(req, res) {
        try {
            const userId = req.user.id;
            const notificationId = req.params.id;

            const updated = await notificationService.markAsRead(notificationId, userId);
            
            return res.status(200).json({
                success: true,
                message: 'Notifikasi ditandai sudah dibaca',
                data: updated
            });
        } catch (error) {
            Logger.error('Controller markAsRead:', error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // PUT /api/.../notifications/read-all
    async markAllAsRead(req, res) {
        try {
            const userId = req.user.id;
            await notificationService.markAllAsRead(userId);
            
            return res.status(200).json({
                success: true,
                message: 'Semua notifikasi ditandai sudah dibaca'
            });
        } catch (error) {
            Logger.error('Controller markAllAsRead:', error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // GET /api/.../notifications/unread-count
    async getUnreadCount(req, res) {
        try {
            const userId = req.user.id;
            const count = await notificationService.getUnreadCount(userId);
            
            return res.status(200).json({
                success: true,
                unread_count: count
            });
        } catch (error) {
            Logger.error('Controller getUnreadCount:', error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new NotificationController();