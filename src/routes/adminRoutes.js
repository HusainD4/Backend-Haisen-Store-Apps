// src/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const multer = require('multer'); // <--- KODE YANG DITAMBAHKAN (Import Multer)

// Impor middleware (sesuaikan dengan nama file middleware otentikasi kamu)
const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// Gunakan memoryStorage agar file bisa langsung dilempar ke Supabase Storage via buffer
const upload = multer({ storage: multer.memoryStorage() });

// Terapkan middleware keamanan untuk SEMUA route di dalam file ini
router.use(verifyToken, isAdmin);

// ==========================================
// TRANSACTIONS ROUTES
// ==========================================
router.get('/transactions', AdminController.getTransactions);
router.get('/transactions/:id', AdminController.getTransactionDetails);
router.patch('/transactions/:id/status', AdminController.updateTransactionStatus);

// ==========================================
// CUSTOMERS (USERS) ROUTES
// ==========================================
router.get('/customers', AdminController.getCustomers);
router.delete('/customers/:id', AdminController.deleteCustomer);

// ==========================================
// PRODUCTS ROUTES
// ==========================================
router.get('/products', AdminController.getProducts);
router.post('/products', AdminController.addProduct);
router.put('/products/:id', AdminController.updateProduct);
router.delete('/products/:id', AdminController.deleteProduct);

// Khusus Manage Stok
router.patch('/products/:id/stock', AdminController.updateStock);

// ==========================================
// BANNERS ROUTES (Ditambahkan upload.single('image'))
// ==========================================
router.get('/banners', AdminController.getBanners);
router.post('/banners', upload.single('image'), AdminController.addBanner);
router.put('/banners/:id', upload.single('image'), AdminController.updateBanner);
router.delete('/banners/:id', AdminController.deleteBanner);


// // Tambahkan baris ini di adminRoutes.js
// router.put('/products/:id/stock', verifyToken, async (req, res) => {
//   try {
//     const data = await AdminController.updateStock(req.params.id, req.body.stock);
//     res.status(200).json({ success: true, message: 'Stok berhasil diupdate', data });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// FIX: Panggil controller langsung sebagai callback Express standar
router.put('/products/:id/stock', verifyToken, AdminController.updateStock);

module.exports = router;