const db = require('../config/supabase');

class StoreService {
    // 1. Mengambil data beranda (Home Data) secara paralel
    async getHomeData(userId) {
        try {
            const bannersPromise = db
                .from('banners')
                .select('id, title, subtitle, image_url, action_text, sort_order')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });
                
            const categoriesPromise = db
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: true });
                
            const productsPromise = db
                .from('products')
                .select('*')
                .eq('is_active', true)
                .eq('is_featured', true)
                .order('created_at', { ascending: true });
            
            let cartPromise = Promise.resolve({ data: [] });
            let favoritesPromise = Promise.resolve({ data: [] });

            if (userId) {
                cartPromise = db.from('carts').select('*, products(*)').eq('user_id', userId);
                favoritesPromise = db.from('user_favorites').select('product_id').eq('user_id', userId);
            }

            const [banners, categories, products, cart, favorites] = await Promise.all([
                bannersPromise, categoriesPromise, productsPromise, cartPromise, favoritesPromise
            ]);

            if (banners.error) throw new Error(banners.error.message);
            if (categories.error) throw new Error(categories.error.message);
            if (products.error) throw new Error(products.error.message);

            return {
                banners: banners.data || [],
                categories: categories.data || [],
                featuredProducts: products.data || [],
                cartItems: cart.data || [],
                favoriteIds: (favorites.data || []).map(f => f.product_id)
            };
        } catch (error) {
            throw new Error(`Store Service Error: ${error.message}`);
        }
    }

    // 2. Mengambil Detail Produk
    async getProductDetail(productId) {
        try {
            // Ambil Data Utama Produk
            const { data: product, error: prodError } = await db
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (prodError) throw new Error(prodError.message);

            // Ambil Multi-Image Gallery (Dibatasi 3 dari DB)
            const { data: images, error: imgError } = await db
                .from('product_images')
                .select('image_url')
                .eq('product_id', productId)
                .order('sort_order', { ascending: true })
                .limit(3);

            if (imgError) throw new Error(imgError.message);

            // Susun gallery array (Masukkan gambar utama ke urutan pertama)
            let gallery = [product.image_url];
            images.forEach(img => {
                if (!gallery.includes(img.image_url) && gallery.length < 3) {
                    gallery.push(img.image_url);
                }
            });

            return {
                ...product,
                gallery: gallery
            };
        } catch (error) {
            throw new Error(`Get Product Detail Error: ${error.message}`);
        }
    }

    // 3. Cek versi aplikasi
    async checkVersion(platform, clientVersion) {
        try {
            const { data, error } = await db
                .from('app_settings')
                .select('*')
                .eq('platform', platform || 'android')
                .single();

            if (error) throw new Error(error.message);

            // Periksa apakah versi klien berbeda dengan versi server
            const needsUpdate = clientVersion && clientVersion !== data.version;

            return {
                latestVersion: data.version,
                forceUpdate: data.force_update,
                message: data.message || 'Versi aplikasi baru tersedia.',
                updateUrl: data.update_url || '',
                needsUpdate: needsUpdate
            };
        } catch (error) {
            throw new Error(`Check Version Error: ${error.message}`);
        }
    }

    // 4. Mengambil daftar produk wishlist secara aman (Menghindari error schema cache Supabase)
    async getWishlist(userId) {
        try {
            // Langkah A: Ambil data dari tabel user_favorites milik user yang sedang login
            const { data: favorites, error: favError } = await db
                .from('user_favorites')
                .select('id, product_id, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (favError) throw new Error(favError.message);
            if (!favorites || favorites.length === 0) return [];

            // Langkah B: Kumpulkan semua product_id ke dalam sebuah array
            const productIds = favorites.map(f => f.product_id);

            // Langkah C: Ambil detail produk dari tabel products berdasarkan kumpulan ID tersebut
            const { data: productList, error: prodError } = await db
                .from('products')
                .select('id, name, subtitle, price, image_url, category_name')
                .in('id', productIds);

            if (prodError) throw new Error(prodError.message);

            // Langkah D: Gabungkan kembali data favorite_id dengan detail produknya secara manual
            return favorites.map(fav => {
                const productDetail = (productList || []).find(p => p.id === fav.product_id) || {};
                return {
                    favorite_id: fav.id,
                    ...productDetail
                };
            });
        } catch (error) {
            throw new Error(`Get Wishlist Error: ${error.message}`);
        }
    }

    // 5. Toggle Favorite (Tambah jika belum ada, Hapus jika sudah ada)
    async toggleFavorite(userId, productId) {
        try {
            const { data: existing, error: selectError } = await db
                .from('user_favorites')
                .select('id')
                .eq('user_id', userId)
                .eq('product_id', productId)
                .maybeSingle();

            if (selectError) throw new Error(selectError.message);

            if (existing) {
                // Hapus jika sudah ada
                const { error: deleteError } = await db
                    .from('user_favorites')
                    .delete()
                    .eq('user_id', userId)
                    .eq('product_id', productId);

                if (deleteError) throw new Error(deleteError.message);
                return { status: 'removed', isFavorite: false, message: 'Produk dihapus dari favorit' };
            } else {
                // Tambah jika belum ada
                const { error: insertError } = await db
                    .from('user_favorites')
                    .insert([{ user_id: userId, product_id: productId }]);

                if (insertError) throw new Error(insertError.message);
                return { status: 'added', isFavorite: true, message: 'Produk ditambahkan ke favorit' };
            }
        } catch (error) {
            throw new Error(`Toggle Favorite Error: ${error.message}`);
        }
    }
}

module.exports = new StoreService();