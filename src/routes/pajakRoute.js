const express = require('express');
const router = express.Router();
const pajakController = require('../controllers/pajakController');

// Endpoint publik untuk mengambil ongkir & pajak
router.get('/settings', pajakController.getStoreSettings);

// Endpoint admin untuk update setting
router.put('/settings', pajakController.updateStoreSetting);

module.exports = router;