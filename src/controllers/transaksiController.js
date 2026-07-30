const transaksiService = require('../services/transaksiService');
const activityLogService = require('../services/activityLogService'); // <-- Import Service Log Aktivitas
const Logger = require('../utils/logger');

class TransaksiController {
    async checkout(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            
            // FIX: Menambahkan shippingAddress dari req.body yang dikirim Flutter
            const { items, shippingFee, totalPrice, status, paymentMethod, paymentChannel, shippingAddress } = req.body;

            if (!userId) return res.status(401).json({ message: 'Unauthorized: User ID tidak ditemukan dalam token' });
            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ message: 'Keranjang belanja kosong' });
            }

            // FIX: Meneruskan shippingAddress ke transaksiService.createCheckout
            const transaction = await transaksiService.createCheckout(
                userId, items, shippingFee, totalPrice, status, paymentMethod, paymentChannel, shippingAddress
            );

            // Catat Log Aktivitas: Checkout / Pembuatan Pesanan Baru
            const transactionId = transaction?.id || transaction?.transaction_id || 'Pesanan';
            await activityLogService.logActivity(
                userId,
                'CHECKOUT',
                'Checkout Pesanan Baru',
                `Pengguna berhasil membuat pesanan baru (ID: ${transactionId}) dengan total Rp ${totalPrice || 0}. Alamat: ${shippingAddress || 'Tidak disertakan'}`,
                req.ip
            );

            res.status(201).json({ message: 'Checkout berhasil', data: transaction });
        } catch (error) {
            Logger.error('Checkout Error:', error.message);
            res.status(500).json({ message: error.message || 'Terjadi kesalahan sistem saat checkout' });
        }
    }

    async getHistory(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            const history = await transaksiService.getUserTransactions(userId);
            
            res.status(200).json({ message: 'Sukses mengambil riwayat', data: history });
        } catch (error) {
            Logger.error('History Error:', error.message);
            res.status(500).json({ message: 'Terjadi kesalahan sistem' });
        }
    }

    async getCounts(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            const counts = await transaksiService.getTransactionCounts(userId);
            
            res.status(200).json({ message: 'Sukses mengambil jumlah status', data: counts });
        } catch (error) {
            Logger.error('Counts Error:', error.message);
            res.status(500).json({ message: 'Terjadi kesalahan sistem' });
        }
    }

    // --- FUNGSI UPDATE STATUS ---
    async updateStatus(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            const { transaction_id, status, paymentMethod, paymentChannel } = req.body;

            if (!transaction_id || !status) {
                return res.status(400).json({ message: 'Transaction ID dan status wajib diisi' });
            }

            const updated = await transaksiService.updateTransactionStatus(
                transaction_id, userId, status, paymentMethod, paymentChannel
            );

            // Catat Log Aktivitas: Perbarui Status Pesanan
            await activityLogService.logActivity(
                userId,
                'UPDATE_TRANSACTION_STATUS',
                'Pembaruan Status Pesanan',
                `Status pesanan (ID: ${transaction_id}) diperbarui menjadi: ${status.toUpperCase()}`,
                req.ip
            );

            res.status(200).json({ message: 'Status berhasil diperbarui', data: updated });
        } catch (error) {
            Logger.error('Update Status Error:', error.message);
            res.status(500).json({ message: 'Terjadi kesalahan sistem' });
        }
    }
}

module.exports = new TransaksiController();