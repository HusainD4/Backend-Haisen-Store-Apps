const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const { verifyToken } = require('../middlewares/auth');

// Lindungi route dengan autentikasi JWT
router.use(verifyToken);

router.get('/', activityLogController.getMyLogs);

module.exports = router;