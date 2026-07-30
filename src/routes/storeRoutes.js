const express = require('express');
const storeController = require('../controllers/storeController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

const optionalToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        return verifyToken(req, res, next);
    }
    next();
};

// Karena di server.js sudah dimounting ke /api/[prefix]/hsn/store
// Maka rute di bawah ini otomatis menjadi:
// - GET  /api/[prefix]/hsn/store/home-data
// - GET  /api/[prefix]/hsn/store/wishlist
// - POST /api/[prefix]/hsn/store/favorite
router.get('/home-data', optionalToken, storeController.getHome);
router.get('/wishlist', verifyToken, storeController.getWishlist);
router.post('/favorite', verifyToken, storeController.toggleFavorite);
router.get('/version-check', storeController.checkAppVersion);
router.get('/product/:id', optionalToken, storeController.getProductDetail);
module.exports = router;