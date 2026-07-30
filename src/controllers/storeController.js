const storeService = require('../services/storeService');
const activityLogService = require('../services/activityLogService'); // <-- Import Service Log Aktivitas
const Logger = require('../utils/logger');

class StoreController {
    async getHome(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            const data = await storeService.getHomeData(userId);
            
            // Log saat akses beranda tidak dicatat sesuai permintaan

            res.status(200).json({ message: 'Sukses mengambil data home', data });
        } catch (error) {
            Logger.error('Get Home Data Error:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getProductDetail(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            const { id } = req.params;
            const data = await storeService.getProductDetail(id);

            // Catat log aktivitas jika user login membuka produk
            if (userId) {
                const productName = data?.name || 'Produk';
                await activityLogService.logActivity(
                    userId,
                    'VIEW_PRODUCT',
                    'Melihat Detail Produk',
                    `Pengguna melihat detail produk: ${productName} (ID: ${id})`,
                    req.ip
                );
            }

            res.status(200).json({ message: 'Sukses mengambil detail produk', data });
        } catch (error) {
            Logger.error('Get Product Detail Error:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async getWishlist(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            const wishlist = await storeService.getWishlist(userId);
            
            res.status(200).json({ message: 'Sukses mengambil wishlist', data: wishlist });
        } catch (error) {
            Logger.error('Get Wishlist Error:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async toggleFavorite(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            const { productId } = req.body;

            if (!productId) {
                return res.status(400).json({ message: 'Product ID harus disertakan' });
            }

            const result = await storeService.toggleFavorite(userId, productId);

            // Catat log aktivitas perubahan produk favorit / wishlist
            await activityLogService.logActivity(
                userId,
                'TOGGLE_FAVORITE',
                'Ubah Status Favorit',
                `Pengguna memperbarui status produk (ID: ${productId}) pada daftar favorit mereka.`,
                req.ip
            );

            res.status(200).json(result);
        } catch (error) {
            Logger.error('Toggle Favorite Error:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async checkAppVersion(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            const { platform, version } = req.query;
            const result = await storeService.checkVersion(platform, version);

            // Catat log jika user login melakukan pengecekan versi
            if (userId) {
                await activityLogService.logActivity(
                    userId,
                    'VERSION_CHECK',
                    'Pemeriksaan Versi Aplikasi',
                    `Aplikasi memeriksa pembaruan pada platform ${platform || 'unknown'} (Versi: ${version || 'unknown'})`,
                    req.ip
                );
            }

            res.status(200).json({ message: 'Status versi diperiksa', data: result });
        } catch (error) {
            Logger.error('Check App Version Error:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new StoreController();