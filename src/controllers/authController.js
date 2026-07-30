const authService = require('../services/authService');
const activityLogService = require('../services/activityLogService'); // <-- Service Log Aktivitas
const Logger = require('../utils/logger');
const nodemailer = require('nodemailer');
const { generateResetPasswordEmailTemplate } = require('../utils/template_email');

// Konfigurasi Nodemailer menggunakan variabel dari file .env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

class AuthController {
    async register(req, res) {
        try {
            const data = req.body;
            
            // Validasi input minimal yang wajib diisi sesuai Flutter
            if (!data.username || !data.fullName || !data.email || !data.password || !data.street_address || !data.city || !data.state_province) {
                return res.status(400).json({ message: 'Lengkapi data akun dan alamat pengiriman wajib secara lengkap' });
            }

            const user = await authService.registerUser(data);

            // Simpan Log Aktivitas: Pendaftaran Akun Baru
            await activityLogService.logActivity(
                user.id,
                'REGISTER',
                'Pendaftaran Akun',
                `Akun baru dengan username @${user.username} berhasil didaftarkan.`,
                req.ip
            );

            res.status(201).json({ message: 'Registrasi berhasil', user });
        } catch (error) {
            Logger.error('Register error:', error.message);
            if (error.message.includes('sudah digunakan')) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: error.message || 'Kesalahan server internal' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email dan password wajib diisi' });
            }

            const result = await authService.authenticateUser(email, password);
            const user = result.user;

            // Simpan Log Aktivitas: Berhasil Login
            await activityLogService.logActivity(
                user.id,
                'LOGIN',
                'Masuk ke Akun',
                `Pengguna berhasil masuk ke sistem menggunakan email ${email}.`,
                req.ip
            );

            res.status(200).json({ message: 'Login berhasil', data: result });
        } catch (error) {
            Logger.error('Login error:', error.message);
            
            const errorMessage = error.message.toLowerCase();

            if (errorMessage.includes('tidak terdaftar') || 
                errorMessage.includes('tidak ditemukan') || 
                errorMessage.includes('not found')) {
                return res.status(404).json({ message: 'Email tidak terdaftar' });
            }
            
            if (errorMessage.includes('password salah') || 
                errorMessage.includes('salah') || 
                errorMessage.includes('incorrect')) {
                return res.status(401).json({ message: 'Email atau password salah' });
            }

            if (error.message === 'Email atau password salah') {
                return res.status(401).json({ message: error.message });
            }

            res.status(500).json({ message: 'Kesalahan server internal' });
        }
    }

    async logout(req, res) {
        try {
            const userId = req.user.id; 
            await authService.logoutUser(userId);
            
            // Simpan Log Aktivitas: Berhasil Logout
            await activityLogService.logActivity(
                userId,
                'LOGOUT',
                'Keluar Akun',
                'Pengguna keluar dari sesi aplikasi.',
                req.ip
            );

            Logger.debug(`User ID ${userId} berhasil logout.`);
            res.status(200).json({ message: 'Logout berhasil' });
        } catch (error) {
            Logger.error('Logout error:', error.message);
            res.status(500).json({ message: 'Terjadi kesalahan saat logout' });
        }
    }

    // ===========================================================================
    // FITUR LUPA & RESET PASSWORD DENGAN OTP 4-DIGIT VIA EMAIL (.env integration)
    // ===========================================================================
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ success: false, message: 'Email wajib diisi' });
            }

            // Pastikan email terdaftar di database
            const userExists = await authService.checkEmailExists(email);
            if (!userExists) {
                return res.status(404).json({ success: false, message: 'Email tidak terdaftar di sistem' });
            }

            // Generate 4 digit OTP random (1000 - 9999)
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Berlaku selama 5 menit

            // Simpan OTP dan masa kedaluwarsa ke database melalui service
            await authService.saveOtp(email, otp, expiresAt);

            // Kirim email menggunakan template terpisah dengan pengirim dari .env
            await transporter.sendMail({
                from: `"Haisen Store" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Kode OTP Reset Kata Sandi Anda',
                html: generateResetPasswordEmailTemplate(otp),
            });

            // Catat Log Aktivitas jika data user ditemukan
            try {
                // Cari ID user berdasarkan email untuk keperluan log
                const userObj = await authService.findUserByEmailForLog ? await authService.findUserByEmailForLog(email) : null;
                // Jika service Anda belum memiliki fungsi pencarian user khusus log, Anda bisa mengambil ID via query atau mengabaikannya jika belum tersedia.
            } catch (_) {}

            Logger.info(`OTP ${otp} berhasil dikirim ke email: ${email}`);
            return res.json({ success: true, message: 'Kode OTP 4-digit berhasil dikirim ke email Anda.' });
        } catch (error) {
            Logger.error('Forgot password error:', error.message);
            return res.status(500).json({ success: false, message: error.message || 'Gagal mengirim email OTP.' });
        }
    }

    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ success: false, message: 'Email dan kode OTP wajib diisi' });
            }

            const isValid = await authService.verifyOtp(email, otp);
            if (!isValid) {
                return res.status(400).json({ success: false, message: 'Kode OTP salah atau telah kedaluwarsa.' });
            }

            return res.json({ success: true, message: 'OTP valid dan terverifikasi.' });
        } catch (error) {
            Logger.error('Verify OTP error:', error.message);
            return res.status(500).json({ success: false, message: error.message || 'Terjadi kesalahan pada server.' });
        }
    }

    async resetPassword(req, res) {
        try {
            const { email, otp, newPassword } = req.body;
            if (!email || !otp || !newPassword) {
                return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ success: false, message: 'Kata sandi baru minimal 6 karakter.' });
            }

            // Verifikasi validitas OTP sebelum memperbarui password
            const isValid = await authService.verifyOtp(email, otp);
            if (!isValid) {
                return res.status(400).json({ success: false, message: 'Sesi OTP tidak valid atau kedaluwarsa.' });
            }

            // Update password dan bersihkan OTP di database
            await authService.updatePasswordByEmail(email, newPassword);
            
            Logger.info(`Password untuk email ${email} berhasil diubah.`);
            return res.json({ success: true, message: 'Kata sandi berhasil diubah.' });
        } catch (error) {
            Logger.error('Reset password error:', error.message);
            return res.status(500).json({ success: false, message: error.message || 'Terjadi kesalahan pada server.' });
        }
    }
}

module.exports = new AuthController();