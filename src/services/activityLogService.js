const db = require('../config/supabase');
const Logger = require('../utils/logger');

class ActivityLogService {
    // Ambil semua log aktivitas milik user tertentu (disertai limit & pagination opsional)
    async getUserLogs(userId, limit = 50) {
        const { data, error } = await db
            .from('user_activity_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            Logger.error('Error getUserLogs:', error);
            throw new Error('Gagal mengambil riwayat log aktivitas');
        }
        return data;
    }

    // Fungsi helper/internal untuk merekam aktivitas baru dari bagian controller lain
    async logActivity(userId, actionType, title, description, ipAddress = null) {
        const { error } = await db
            .from('user_activity_logs')
            .insert([{
                user_id: userId,
                action_type: actionType,
                title: title,
                description: description,
                ip_address: ipAddress
            }]);

        if (error) {
            Logger.error('Error logActivity (Silent Fail):', error);
        }
    }
}

module.exports = new ActivityLogService();