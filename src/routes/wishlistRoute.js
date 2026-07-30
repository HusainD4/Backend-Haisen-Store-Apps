const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const verifyToken = require('../middlewares/verifyToken');

// Rute ini akan dipanggil dari Flutter
router.get('/', verifyToken, wishlistController.getWishlist);
router.post('/toggle', verifyToken, wishlistController.toggleFavorite);

module.exports = router;