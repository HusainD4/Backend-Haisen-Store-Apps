const db = require('../config/supabase');
const Logger = require('../utils/logger');

class PajakService {
    // Mengambil semua pengaturan toko
    async getSettings() {
        const { data, error } = await db
            .from('store_settings')
            .select('key, value, description');

        if (error) {
            Logger.error('Supabase Get Settings Error:', error.message);
            throw new Error(error.message);
        }
        
        // Mengubah array database menjadi objek key-value (Contoh: { tax: 11, shipping_cost: 10000 })
        const settings = {};
        (data || []).forEach(item => {
            settings[item.key] = Number(item.value);
        });

        return settings;
    }

    // Memperbarui nilai berdasarkan key
    async updateSetting(key, value) {
        const { data, error } = await db
            .from('store_settings')
            .update({ 
                value: Number(value), 
                updated_at: new Date() 
            })
            .eq('key', key)
            .select()
            .single();

        if (error) {
            Logger.error(`Supabase Update Setting Error (${key}):`, error.message);
            throw new Error(error.message);
        }
        return data;
    }
}

module.exports = new PajakService();