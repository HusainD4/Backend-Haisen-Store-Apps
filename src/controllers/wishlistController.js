const wishlistService = require('../services/wishlistService');
const Logger = require('../utils/logger');

class WishlistController {
    async getWishlist(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            const wishlist = await wishlistService.getWishlistByUserId(userId);
            res.status(200).json({ message: 'Sukses mengambil wishlist', data: wishlist });
        } catch (error) {
            Logger.error('Get Wishlist Error:', error.message);
            res.status(500).json({ message: error.message });
        }
    }

    async toggleFavorite(req, res) {
        try {
            const userId = req.user?.id || req.user?.userId;
            const { productId } = req.body;

            if (!productId) {
                return res.status(400).json({ message: 'Product ID harus disertakan' });
            }

            const result = await wishlistService.toggleFavorite(userId, productId);
            res.status(200).json(result);
        } catch (error) {
            Logger.error('Toggle Favorite Error:', error.message);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new WishlistController();