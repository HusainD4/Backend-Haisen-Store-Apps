const bcrypt = require('bcrypt');
const db = require('./config/supabase');
const Logger = require('./utils/logger');

class AdminGenerator {
    async registerUser(userData) {
        const { 
            username, 
            fullName, 
            email, 
            password, 
            phoneNumber, 
            birthDate, 
            street_address, 
            city, 
            state_province, 
            postal_code, 
            country,
            role 
        } = userData;

        // 1. Cek duplikasi email atau username
        const { data: existingUser } = await db
            .from('users')
            .select('id, username, email')
            .or(`username.eq.${username},email.eq.${email}`)
            .maybeSingle();

        // Jika user sudah ada, kembalikan status skipped
        if (existingUser) {
            return { 
                skipped: true, 
                fullname: fullName, 
                username: username, 
                email: email 
            };
        }

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 3. Simpan seluruh data lengkap ke tabel Supabase users
        const { data: newUser, error: insertError } = await db
            .from('users')
            .insert([{ 
                username: username, 
                fullname: fullName, 
                email: email, 
                password_hash: hashedPassword, 
                phone_number: phoneNumber || null, 
                date_of_birth: birthDate || null, 
                street_address: street_address || null,
                city: city || null,
                state_province: state_province || null,
                postal_code: postal_code || null,
                country: country || 'Indonesia',
                role: role || 'user',
                is_login: false
            }])
            .select('id, username, email, fullname, role, phone_number, street_address, city, state_province, postal_code, country')
            .single();

        if (insertError) {
            Logger.error('Supabase Insert Error:', insertError);
            throw new Error(insertError.message || 'Gagal menyimpan data ke database');
        }
        
        return { skipped: false, ...newUser };
    }

    async generateDefaultAdmins() {
        try {
            console.log('Memulai pengecekan dan pembuatan akun Admin & Super Admin...');

            // 1. Membuat Husain Admin
            const adminData = {
                username: 'husain_admin',
                fullName: 'Husain Admin',
                email: 'admin.husain@gmail.com',
                password: 'Husain28',
                role: 'admin',
                city: 'Jakarta',
                country: 'Indonesia'
            };
            const adminResult = await this.registerUser(adminData);
            
            if (adminResult.skipped) {
                console.log(`[SKIPPED] Akun Admin (${adminResult.fullname} - ${adminResult.email}) sudah ada.`);
            } else {
                console.log('Berhasil membuat akun:', adminResult.fullname);
            }

            // 2. Membuat Husain Super Admin
            const superAdminData = {
                username: 'husain_superadmin',
                fullName: 'Husain Super Admin',
                email: 'superadmin.husain@gmail.com',
                password: 'Husain28',
                role: 'super_admin',
                city: 'Jakarta',
                country: 'Indonesia'
            };
            const superAdminResult = await this.registerUser(superAdminData);
            
            if (superAdminResult.skipped) {
                console.log(`[SKIPPED] Akun Super Admin (${superAdminResult.fullname} - ${superAdminResult.email}) sudah ada.`);
            } else {
                console.log('Berhasil membuat akun:', superAdminResult.fullname);
            }

            console.log('Semua proses akun admin selesai.');
        } catch (error) {
            console.error('Gagal melakukan generate admin:', error.message);
        }
    }
}

// Eksekusi generator
const generator = new AdminGenerator();
generator.generateDefaultAdmins();