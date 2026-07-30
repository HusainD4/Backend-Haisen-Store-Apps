// src/services/adminService.js

const supabase = require('../config/supabase');

class AdminService {
  // ==========================================
  // MANAGE TRANSACTIONS
  // ==========================================
  static async getAllTransactions(limit = 1000, offset = 0) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        user_id,
        shipping_fee,
        total_price,
        status,
        payment_method,
        payment_channel,
        created_at,
        shipping_address,
        users(id, email, fullname, phone_number, street_address, city, state_province, postal_code), 
        transaction_details(*)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetch transactions:', error.message);
      throw error;
    }
    return data || [];
  }

  static async getTransactionById(id) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        user_id,
        shipping_fee,
        total_price,
        status,
        payment_method,
        payment_channel,
        created_at,
        shipping_address,
        users(id, email, fullname, phone_number, street_address, city, state_province, postal_code), 
        transaction_details(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTransactionStatus(id, status) {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ==========================================
  // MANAGE CUSTOMERS (USERS) & COUNT
  // ==========================================
  static async getAllCustomers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(10000)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetch users:', error.message);
      throw error;
    }
    return data || [];
  }

  static async getCustomerById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteCustomer(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Method baru untuk mengambil rekapitulasi jumlah user, regular user, dan admin
  static async getUserCount() {
    const { data, error } = await supabase
      .from('users')
      .select('role');
    
    if (error) {
      console.error('Error fetch user count:', error.message);
      throw error;
    }

    const usersList = data || [];
    const total = usersList.length;
    
    const admins = usersList.filter(u => {
      const role = (u.role || 'user').toString().toLowerCase();
      return role === 'admin' || role === 'superadmin';
    }).length;

    const regularUsers = total - admins;

    return {
      total: total,
      users: regularUsers,
      admins: admins
    };
  }

  // ==========================================
  // MANAGE PRODUCTS & STOCK
  // ==========================================
  static async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createProduct(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateProduct(id, productData) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async updateStock(id, stock) {
    const { data, error } = await supabase
      .from('products')
      .update({ stock })
      .eq('id', id)
      .select('id, name, stock')
      .single();
    
    if (error) throw error;
    return data;
  }

  // ==========================================
  // MANAGE BANNERS (TANPA BATASAN RASIO / UKURAN)
  // ==========================================
  static async uploadBannerImage(file) {
    const bucketName = 'banner'; 
    const fileExt = file.originalname ? file.originalname.split('.').pop() : 'png';
    const fileName = `banner-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Gagal upload banner ke Storage: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  static async getAllBanners() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  static async createBanner(bannerData, file) {
    let imageUrl = bannerData.image_url;

    if (file) {
      imageUrl = await this.uploadBannerImage(file);
    }

    const payload = {
      title: bannerData.title,
      subtitle: bannerData.subtitle || null,
      image_url: imageUrl,
      action_text: bannerData.action_text || 'Shop Now',
      is_active: bannerData.is_active === 'true' || bannerData.is_active === true,
      sort_order: Number(bannerData.sort_order) || 0
    };

    const { data, error } = await supabase
      .from('banners')
      .insert([payload])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateBanner(id, bannerData, file) {
    let imageUrl = bannerData.image_url;

    if (file) {
      imageUrl = await this.uploadBannerImage(file);
    }

    const payload = {
      title: bannerData.title,
      subtitle: bannerData.subtitle || null,
      ...(imageUrl && { image_url: imageUrl }),
      action_text: bannerData.action_text || 'Shop Now',
      is_active: bannerData.is_active === 'true' || bannerData.is_active === true,
      sort_order: Number(bannerData.sort_order) || 0
    };

    const { data, error } = await supabase
      .from('banners')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteBanner(id) {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

module.exports = AdminService;