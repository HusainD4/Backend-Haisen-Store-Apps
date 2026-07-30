const express = require('express');
const cors = require('cors'); // Pastikan Anda sudah menjalankan "npm install cors"
const config = require('./config/env');
const Logger = require('./utils/logger');

// ==========================================
// IMPORT ROUTER
// ==========================================
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const userRoute = require('./routes/userRoute');
const transaksiRoute = require('./routes/transaksiRoute');
const notificationRoute = require('./routes/notificationRoute');
const activityLogRoute = require('./routes/activityLogRoute');
const adminRoutes = require('./routes/adminRoutes');
const pajakRoutes = require('./routes/pajakRoute'); // Router Pajak & Ongkir

const app = express();

// ==========================================
// MIDDLEWARE GLOBAL
// ==========================================
app.use(cors()); // Mengizinkan request dari aplikasi Flutter/Client
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ENDPOINT STATUS & INFO (HEALTH CHECK)
// ==========================================
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Haisen Store Backend is running smoothly 🚀',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'success',
        uptime: process.uptime(),
        message: 'API is ready to receive requests.'
    });
});

// Endpoint untuk mengambil versi aplikasi (Digunakan di Sidebar Flutter)
app.get('/version-check', (req, res) => {
    res.status(200).json({
        success: true,
        version: 'v1.0.0',
        message: 'Latest application version'
    });
});

// ==========================================
// CUSTOM LONG ROUTE MOUNTING
// Format: /api/[hashing_unik]/hsn/[resource]
// ==========================================
const SECRET_PREFIX = config.apiPrefix;

// Mounting Routes
app.use(`/api/${SECRET_PREFIX}/hsn/auth`, authRoutes);
app.use(`/api/${SECRET_PREFIX}/hsn/store`, storeRoutes);
app.use(`/api/${SECRET_PREFIX}/hsn/users`, userRoute); 
app.use(`/api/${SECRET_PREFIX}/hsn/transaksi`, transaksiRoute);
app.use(`/api/${SECRET_PREFIX}/hsn/notifications`, notificationRoute);
app.use(`/api/${SECRET_PREFIX}/hsn/activity-logs`, activityLogRoute);
app.use(`/api/${SECRET_PREFIX}/hsn/admin`, adminRoutes);
app.use(`/api/${SECRET_PREFIX}/hsn/store-settings`, pajakRoutes); // Mengarahkan ke /store-settings/settings

// ==========================================
// ERROR HANDLING MIDDLEWARE
// ==========================================

// 1. Handle 404 (Route Not Found)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route tidak ditemukan: ${req.method} ${req.originalUrl}`
    });
});

// 2. Handle Global Error
app.use((err, req, res, next) => {
    Logger.error(`Server Error: ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// ==========================================
// JALANKAN SERVER
// ==========================================
app.listen(config.port, () => {
    Logger.info(`🚀 Server berjalan di port ${config.port}`);
    Logger.info(`Base Route Auth         : /api/${SECRET_PREFIX}/hsn/auth`);
    Logger.info(`Base Route Store        : /api/${SECRET_PREFIX}/hsn/store`);
    Logger.info(`Base Route Users        : /api/${SECRET_PREFIX}/hsn/users`);
    Logger.info(`Base Route Transaksi    : /api/${SECRET_PREFIX}/hsn/transaksi`);
    Logger.info(`Base Route Notifikasi   : /api/${SECRET_PREFIX}/hsn/notifications`);
    Logger.info(`Base Route Admin        : /api/${SECRET_PREFIX}/hsn/admin`);
    Logger.info(`Base Route Store Set    : /api/${SECRET_PREFIX}/hsn/store-settings`);
});