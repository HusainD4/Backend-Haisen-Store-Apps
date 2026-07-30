const userService = require('../services/userService');
const activityLogService = require('../services/activityLogService'); // <-- Import Service Log Aktivitas
const Logger = require('../utils/logger');

class UserController {
    async getProfile(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            const user = await userService.getUserById(userId);

            // Log untuk melihat profil tidak dicatat sesuai permintaan

            res.status(200).json({ message: 'Sukses mengambil profil', data: user });
        } catch (error) {
            Logger.error('Get Profile Error:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getTotalUsers(req, res) {
        try {
            // PERBAIKAN: Ubah UserService (U besar) menjadi userService (u kecil) sesuai nama import di atas
            const total = await userService.getTotalUsers();
            
            return res.status(200).json({
                success: true,
                message: 'Berhasil mendapatkan total pengguna',
                data: {
                    total_users: total
                }
            });
        } catch (error) {
            Logger.error('Controller Error - getTotalUsers:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan pada server',
                error: error.message
            });
        }
    }

    // TAMBAHAN BARU: Fungsi untuk mengambil semua data user (untuk tabel admin)
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            
            return res.status(200).json({
                success: true,
                message: 'Berhasil mengambil semua data user',
                data: users
            });
        } catch (error) {
            Logger.error('Controller Error - getAllUsers:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan pada server',
                error: error.message
            });
        }
    }
    
    async updateProfile(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized: User ID tidak ditemukan' });
            }

            const updateData = req.body;
            const file = req.file;

            const updatedUser = await userService.updateProfileWithAvatar(userId, updateData, file);
            
            // Catat Log Aktivitas: Berhasil Memperbarui Profil
            await activityLogService.logActivity(
                userId,
                'UPDATE_PROFILE',
                'Pembaruan Profil',
                'Pengguna memperbarui informasi profil dan data diri.',
                req.ip
            );

            res.status(200).json({
                message: 'Profil berhasil diperbarui',
                data: updatedUser
            });
        } catch (error) {
            Logger.error('Update Profile Controller Error:', error.message);
            res.status(500).json({ message: error.message || 'Terjadi kesalahan sistem' });
        }
    }
}

module.exports = new UserController();