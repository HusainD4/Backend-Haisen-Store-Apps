// src/controllers/adminController.js

const AdminService = require('../services/adminService');
// CATATAN: Jika kamu punya file activityLogService, aktifkan baris di bawah ini. 
// Jika tidak punya, fungsi pencatatan log di bawah akan diabaikan secara aman.
// const activityLogService = require('../services/activityLogService');

class AdminController {
  // ==========================================
  // TRANSACTIONS
  // ==========================================
  static async getTransactions(req, res) {
    try {
      const { limit, offset } = req.query;
      const data = await AdminService.getAllTransactions(limit, offset);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Get Transactions Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getTransactionDetails(req, res) {
    try {
      const data = await AdminService.getTransactionById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Get Transaction Details Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateTransactionStatus(req, res) {
    try {
      const { status } = req.body;
      const data = await AdminService.updateTransactionStatus(req.params.id, status);
      res.status(200).json({ success: true, message: 'Status transaksi berhasil diupdate', data });
    } catch (error) {
      console.error('Update Transaction Status Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ==========================================
  // CUSTOMERS (USERS)
  // ==========================================
  static async getCustomers(req, res) {
    try {
      const data = await AdminService.getAllCustomers();
      res.status(200).json({ 
        success: true, 
        message: 'Sukses mengambil data pelanggan',
        data 
      });
    } catch (error) {
      console.error('Get Customers Error:', error.message);
      res.status(500).json({ success: false, message: error.message || 'Terjadi kesalahan sistem saat mengambil data pelanggan' });
    }
  }

  static async deleteCustomer(req, res) {
    try {
      const adminId = req.user?.id || req.user?.userId;
      const customerId = req.params.id;

      await AdminService.deleteCustomer(customerId);

      if (adminId && typeof activityLogService !== 'undefined') {
        try {
          await activityLogService.logActivity(
            adminId,
            'DELETE_CUSTOMER',
            'Hapus Akun Pelanggan',
            `Admin menghapus akun pelanggan dengan ID: ${customerId}`,
            req.ip
          );
        } catch (logError) {
          console.error('Gagal mencatat log aktivitas:', logError.message);
        }
      }

      res.status(200).json({ 
        success: true, 
        message: 'Pelanggan berhasil dihapus' 
      });
    } catch (error) {
      console.error('Delete Customer Error:', error.message);
      res.status(500).json({ success: false, message: error.message || 'Gagal menghapus pelanggan' });
    }
  }

  // ==========================================
  // PRODUCTS & STOCK
  // ==========================================
  static async getProducts(req, res) {
    try {
      const data = await AdminService.getAllProducts();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Get Products Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async addProduct(req, res) {
    try {
      const data = await AdminService.createProduct(req.body);
      res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan', data });
    } catch (error) {
      console.error('Add Product Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      const data = await AdminService.updateProduct(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Produk berhasil diupdate', data });
    } catch (error) {
      console.error('Update Product Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      await AdminService.deleteProduct(req.params.id);
      res.status(200).json({ success: true, message: 'Produk berhasil dihapus' });
    } catch (error) {
      console.error('Delete Product Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateStock(req, res) {
    try {
      const { stock } = req.body;
      
      // Validasi untuk memastikan 'stock' dikirim dalam req.body
      if (stock === undefined || stock === null) {
        return res.status(400).json({ 
          success: false, 
          message: 'Data stok (stock) wajib dikirim.' 
        });
      }

      const data = await AdminService.updateStock(req.params.id, stock);
      res.status(200).json({ success: true, message: 'Stok berhasil diperbarui', data });
    } catch (error) {
      console.error('Update Stock Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // ==========================================
  // BANNERS
  // ==========================================
  static async getBanners(req, res) {
    try {
      const data = await AdminService.getAllBanners();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Get Banners Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async addBanner(req, res) {
    try {
      const data = await AdminService.createBanner(req.body, req.file);
      res.status(201).json({ success: true, message: 'Banner berhasil ditambahkan', data });
    } catch (error) {
      console.error('Add Banner Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateBanner(req, res) {
    try {
      const data = await AdminService.updateBanner(req.params.id, req.body, req.file);
      res.status(200).json({ success: true, message: 'Banner berhasil diupdate', data });
    } catch (error) {
      console.error('Update Banner Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteBanner(req, res) {
    try {
      await AdminService.deleteBanner(req.params.id);
      res.status(200).json({ success: true, message: 'Banner berhasil dihapus' });
    } catch (error) {
      console.error('Delete Banner Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AdminController;