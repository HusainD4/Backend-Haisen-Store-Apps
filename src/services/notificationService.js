const db = require('../config/supabase');
const Logger = require('../utils/logger');

class NotificationService {
    // Ambil semua notifikasi milik user tertentu
    async getUserNotifications(userId) {
        const { data, error } = await db
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            Logger.error('Error getNotifications:', error);
            throw new Error('Gagal mengambil data notifikasi');
        }
        return data;
    }

    // Tandai satu notifikasi sudah dibaca
    async markAsRead(notificationId, userId) {
        const { data, error } = await db
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .eq('user_id', userId) // Keamanan: Pastikan notifikasi milik user yang merequest
            .select()
            .single();

        if (error) {
            Logger.error('Error markAsRead:', error);
            throw new Error('Gagal memperbarui status notifikasi');
        }
        return data;
    }

    // Tandai semua notifikasi user sudah dibaca
    async markAllAsRead(userId) {
        const { error } = await db
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false); // Hanya update yang belum dibaca

        if (error) {
            Logger.error('Error markAllAsRead:', error);
            throw new Error('Gagal memperbarui semua status notifikasi');
        }
        return true;
    }

    // Fungsi internal untuk membuat notifikasi baru (bisa dipanggil saat checkout, register, dll)
    async createNotification(userId, title, message, type = 'system') {
        const { error } = await db
            .from('notifications')
            .insert([{
                user_id: userId,
                title: title,
                message: message,
                type: type,
                is_read: false
            }]);

        if (error) {
            Logger.error('Error createNotification:', error);
            // Tidak perlu throw error agar tidak mengganggu flow utama transaksi (silent fail log only)
        }
    }

    // Hitung total notifikasi yang belum dibaca
    async getUnreadCount(userId) {
        const { count, error } = await db
            .from('notifications')
            .select('*', { count: 'exact', head: true }) // head: true agar tidak mengambil isi datanya, hanya angkanya
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) {
            Logger.error('Error getUnreadCount:', error);
            throw new Error('Gagal menghitung jumlah notifikasi');
        }
        return count || 0;
    }
}

module.exports = new NotificationService();