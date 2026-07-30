const db = require('../config/supabase');
const Logger = require('../utils/logger');

class UserService {
    async getUserById(userId) {
        const { data, error } = await db
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    // Fungsi untuk menghitung total user (digunakan di endpoint /count)
    async getTotalUsers() {
        // Menggunakan count: 'exact' dan head: true agar Supabase 
        // hanya mengembalikan angka jumlahnya saja tanpa memuat seluruh data barisnya.
        const { count, error } = await db
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (error) {
            Logger.error('Supabase Count Error:', error.message);
            throw new Error(`Gagal menghitung total user: ${error.message}`);
        }

        return count;
    }

    // TAMBAHAN BARU: Fungsi untuk mengambil semua data user (digunakan di tabel pelanggan)
    async getAllUsers() {
        const { data, error } = await db
            .from('users')
            .select('*')
            .order('created_at', { ascending: false }); // Mengurutkan user dari yang paling baru mendaftar

        if (error) {
            Logger.error('Supabase Get All Users Error:', error.message);
            throw new Error(`Gagal mengambil semua data user: ${error.message}`);
        }
        return data;
    }

    async updateProfileWithAvatar(userId, updateData, file) {
        // 1. Ambil data user saat ini untuk memeriksa apakah sudah ada foto lama
        const currentUser = await this.getUserById(userId);
        let avatarUrl = updateData.avatar_url || currentUser.avatar_url;
        const bucketName = 'profile'; // Sesuai dengan nama bucket di Supabase Anda

        // 2. Jika user mengunggah file foto baru
        if (file) {
            const fileName = `avatar-${userId}-${Date.now()}.png`;
            const filePath = `avatars/${fileName}`;

            // Upload foto baru ke Supabase Storage
            const { error: uploadError } = await db.storage
                .from(bucketName)
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true
                });

            if (uploadError) {
                Logger.error('Supabase Storage Upload Error:', uploadError.message);
                throw new Error(`Gagal upload gambar ke Storage: ${uploadError.message}`);
            }

            // Ambil Public URL dari foto yang baru diunggah
            const { data: publicUrlData } = db.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            if (publicUrlData && publicUrlData.publicUrl) {
                avatarUrl = publicUrlData.publicUrl;
            }

            // 3. Hapus foto lama dari Supabase Storage jika user sebelumnya sudah punya avatar_url
            if (currentUser.avatar_url) {
                try {
                    // Ekstraksi path relatif file lama dari URL publik Supabase
                    // Contoh URL: .../storage/v1/object/public/profile/avatars/avatar-xxx.png
                    const urlParts = currentUser.avatar_url.split(`/${bucketName}/`);
                    if (urlParts.length > 1) {
                        const oldFilePath = urlParts[1];
                        
                        const { error: removeError } = await db.storage
                            .from(bucketName)
                            .remove([oldFilePath]);

                        if (removeError) {
                            Logger.error('Gagal menghapus foto lama di storage:', removeError.message);
                        } else {
                            Logger.info(`Foto lama berhasil dihapus: ${oldFilePath}`);
                        }
                    }
                } catch (err) {
                    Logger.error('Exception saat menghapus foto lama:', err.message);
                }
            }
        }

        // 4. Siapkan payload data untuk diperbarui ke database tabel users
        const payload = {
            username: updateData.username || undefined,
            fullname: updateData.fullname || null,
            phone_number: updateData.phone_number || null,
            street_address: updateData.street_address || null,
            city: updateData.city || null,
            state_province: updateData.state_province || null,
            postal_code: updateData.postal_code || null,
            country: updateData.country || 'Indonesia',
            place_of_birth: updateData.place_of_birth || null,
            date_of_birth: updateData.date_of_birth || null,
            ...(avatarUrl && { avatar_url: avatarUrl }),
            updated_at: new Date()
        };

        // Hapus key yang bernilai undefined agar tidak menimpa data lama dengan kosong
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { data, error } = await db
            .from('users')
            .update(payload)
            .eq('id', userId)
            .select('*')
            .single();

        if (error) {
            Logger.error('Supabase Update Database Error:', error.message);
            throw new Error(`Database Error: ${error.message}`);
        }

        return data;
    }
}

module.exports = new UserService();