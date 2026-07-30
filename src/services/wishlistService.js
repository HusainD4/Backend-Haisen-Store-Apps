const db = require('../config/supabase');

class WishlistService {
    // 1. Mengambil daftar wishlist berdasarkan user_id
    async getWishlistByUserId(userId) {
        // Melakukan join tabel user_favorites dengan tabel products
        const { data, error } = await db
            .from('user_favorites')
            .select(`
                id,
                created_at,
                products:product_id (
                    id,
                    name,
                    subtitle,
                    price,
                    image_url,
                    category_name
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Gagal mengambil wishlist: ${error.message}`);
        }
        
        // Meratakan (flatten) struktur JSON agar mudah dibaca oleh Flutter
        return data.map(item => ({
            favorite_id: item.id,
            ...(item.products || {}) 
        }));
    }

    // 2. Fungsi Toggle (Tambah jika belum ada, Hapus jika sudah ada)
    async toggleFavorite(userId, productId) {
        // Cek apakah produk sudah ada di wishlist user ini
        const { data: existingData } = await db
            .from('user_favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (existingData) {
            // Jika SUDAH ADA, hapus dari tabel user_favorites
            const { error } = await db
                .from('user_favorites')
                .delete()
                .eq('id', existingData.id);
                
            if (error) throw new Error(error.message);
            return { message: 'Produk dihapus dari favorit', isFavorite: false };
        } else {
            // Jika BELUM ADA, tambahkan ke tabel user_favorites
            const { error } = await db
                .from('user_favorites')
                .insert([{ user_id: userId, product_id: productId }]);
                
            if (error) throw new Error(error.message);
            return { message: 'Produk ditambahkan ke favorit', isFavorite: true };
        }
    }
}

module.exports = new WishlistService();