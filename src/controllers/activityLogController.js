const activityLogService = require('../services/activityLogService');
const Logger = require('../utils/logger');

class ActivityLogController {
    async getMyLogs(req, res) {
        try {
            const userId = req.user.id; // Dari middleware verifyToken
            const logs = await activityLogService.getUserLogs(userId);

            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil riwayat log aktivitas',
                data: logs
            });
        } catch (error) {
            Logger.error('Controller getMyLogs:', error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ActivityLogController();