const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const { verifyToken } = require('../middlewares/auth');

router.post('/checkout', verifyToken, transaksiController.checkout);
router.get('/history', verifyToken, transaksiController.getHistory);
router.get('/counts', verifyToken, transaksiController.getCounts);
router.put('/update-status', verifyToken, transaksiController.updateStatus);

module.exports = router;