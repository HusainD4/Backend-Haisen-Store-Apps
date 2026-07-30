// src/middlewares/isAdmin.js

const isAdmin = (req, res, next) => {
  try {
    // Asumsi req.user di-set oleh verifyToken.js sebelumnya
    const userRole = req.user?.role?.toLowerCase();
    
    if (userRole === 'admin' || userRole === 'superadmin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Endpoint ini hanya untuk Administrator.',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada otorisasi admin',
      error: error.message
    });
  }
};

module.exports = isAdmin;