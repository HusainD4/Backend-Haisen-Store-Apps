const pajakService = require('../services/pajakService');
const Logger = require('../utils/logger');

class PajakController {
    async getStoreSettings(req, res) {
        try {
            const settings = await pajakService.getSettings();
            return res.status(200).json({
                success: true,
                message: 'Sukses mengambil data ongkir dan pajak',
                data: settings
            });
        } catch (error) {
            Logger.error('Get Store Settings Error:', error.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Terjadi kesalahan sistem' 
            });
        }
    }

    async updateStoreSetting(req, res) {
        try {
            const updateData = req.body; // Diharapkan menerima: { tax: 11, shipping_cost: 15000 }

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Data pembaruan tidak boleh kosong' 
                });
            }

            const updatedResults = [];
            for (const [key, value] of Object.entries(updateData)) {
                if (value !== undefined) {
                    const updated = await pajakService.updateSetting(key, value);
                    updatedResults.push(updated);
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Pengaturan berhasil diperbarui',
                data: updatedResults
            });
        } catch (error) {
            Logger.error('Update Store Setting Error:', error.message);
            return res.status(500).json({ 
                success: false, 
                message: error.message || 'Terjadi kesalahan sistem' 
            });
        }
    }
}

module.exports = new PajakController();