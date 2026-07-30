const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/supabase');
const config = require('../config/env');
const Logger = require('../utils/logger');

class AuthService {
    async registerUser(userData) {
        // Ambil semua data lengkap dari payload request Flutter
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
            country 
        } = userData;

        // 1. Cek duplikasi email atau username
        const { data: existingUser } = await db
            .from('users')
            .select('id, username, email')
            .or(`username.eq.${username},email.eq.${email}`)
            .maybeSingle();

        if (existingUser) {
            if (existingUser.email === email) throw new Error('Email sudah digunakan');
            if (existingUser.username === username) throw new Error('Username sudah digunakan');
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
                is_login: false
            }])
            .select('id, username, email, fullname, role, phone_number, street_address, city, state_province, postal_code, country')
            .single();

        if (insertError) {
            Logger.error('Supabase Insert Error:', insertError);
            throw new Error(insertError.message || 'Gagal menyimpan data ke database');
        }
        
        return newUser;
    }

    async authenticateUser(email, password) {
        // 1. Cari user berdasarkan email
        const { data: user, error } = await db
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle(); 

        if (error) {
            Logger.error('Database query error saat login:', error);
            throw new Error('Kesalahan database saat mencari user');
        }

        // 2. Jika user (email) tidak ditemukan
        if (!user) {
            throw new Error('Email tidak terdaftar'); 
        }

        // 3. Validasi Password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Password salah');
        }

        // 4. Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwtSecret,
            { expiresIn: '7d' }
        );

        // 5. Update status is_login dan token di database
        const { error: updateError } = await db
            .from('users')
            .update({ is_login: true, token: token })
            .eq('id', user.id);
            
        if (updateError) {
            Logger.error('Gagal update is_login saat login:', updateError);
        }

        Logger.debug(`User ${email} berhasil login.`);
        return { 
            token, 
            user: { 
                id: user.id, 
                username: user.username, 
                fullname: user.fullname,
                email: user.email,
                phone_number: user.phone_number,
                street_address: user.street_address,
                city: user.city,
                state_province: user.state_province,
                postal_code: user.postal_code,
                country: user.country,
                role: user.role
            } 
        };
    }

    async logoutUser(userId) {
        const { error } = await db
            .from('users')
            .update({ is_login: false, token: null })
            .eq('id', userId);

        if (error) throw new Error('Gagal melakukan logout di database');
        return true;
    }

    // ===========================================================================
    // --- FITUR LUPA & RESET PASSWORD (SUPABASE IMPLEMENTATION) ---
    // ===========================================================================

    // Cek apakah email terdaftar di database
    async checkEmailExists(email) {
        const { data, error } = await db
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (error) {
            Logger.error('Error checkEmailExists:', error);
            return false;
        }
        return !!data;
    }

    // Simpan OTP dan waktu kedaluwarsa ke database Supabase
    async saveOtp(email, otp, expiresAt) {
        const { error } = await db
            .from('users')
            .update({ 
                otp: otp, 
                otp_expires_at: expiresAt.toISOString(), 
                updated_at: new Date().toISOString() 
            })
            .eq('email', email);

        if (error) {
            Logger.error('Error saveOtp:', error);
            throw new Error('Gagal menyimpan kode OTP ke database');
        }
    }

    // Verifikasi OTP yang dikirim user
    async verifyOtp(email, otp) {
        const { data, error } = await db
            .from('users')
            .select('id, otp, otp_expires_at')
            .eq('email', email)
            .maybeSingle();

        if (error || !data) return false;

        // Cek kecocokan OTP dan pastikan belum kedaluwarsa
        const now = new Date();
        const expiresAt = data.otp_expires_at ? new Date(data.otp_expires_at) : null;

        if (!data.otp || data.otp !== otp || !expiresAt || expiresAt < now) {
            return false;
        }

        return true;
    }

    // Update password baru dan kosongkan kolom OTP
    async updatePasswordByEmail(email, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const { error } = await db
            .from('users')
            .update({ 
                password_hash: hashedPassword, 
                otp: null, 
                otp_expires_at: null, 
                updated_at: new Date().toISOString() 
            })
            .eq('email', email);

        if (error) {
            Logger.error('Error updatePasswordByEmail:', error);
            throw new Error('Gagal memperbarui kata sandi di database');
        }
    }
}

module.exports = new AuthService();