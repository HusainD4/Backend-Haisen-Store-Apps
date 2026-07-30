const express = require('express');
const router = express.Router();

// Anda mendeklarasikannya dengan "userController" (huruf u kecil)
const userController = require('../controllers/userController'); 
const verifyToken = require('../middlewares/verifyToken');
const multer = require('multer');

// Gunakan memoryStorage agar file bisa langsung dilempar ke Supabase Storage via buffer
const upload = multer({ storage: multer.memoryStorage() });
router.get('/', userController.getAllUsers);
// Pindahkan route /count ke atas sebelum route dinamis (jika ada) untuk praktik yang baik
router.get('/count', userController.getTotalUsers); // <-- PERBAIKI DI SINI (gunakan u kecil)

router.get('/profile', verifyToken, userController.getProfile);
router.put('/update-profile', verifyToken, upload.single('avatar'), userController.updateProfile);

module.exports = router;