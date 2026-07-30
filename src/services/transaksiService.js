const db = require('../config/supabase');
const Logger = require('../utils/logger');

class TransaksiService {
    // FIX: Menambahkan parameter `shippingAddress` pada fungsi
    async createCheckout(userId, items, shippingFee, totalPrice, status = 'PENDING', paymentMethod = null, paymentChannel = null, shippingAddress = null) {
        // 1. Simpan header transaksi utama
        const { data: transaction, error: trxError } = await db
            .from('transactions')
            .insert([{
                user_id: userId,
                shipping_fee: Number(shippingFee) || 0,
                total_price: Number(totalPrice) || 0,
                status: status, 
                payment_method: paymentMethod,
                payment_channel: paymentChannel,
                shipping_address: shippingAddress // <-- MENYIMPAN ALAMAT KE DATABASE
            }])
            .select('*')
            .single();

        if (trxError) throw new Error(`Gagal membuat transaksi: ${trxError.message}`);

        // 2. Petakan item produk dengan aman
        const detailItems = items.map(item => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            const subtotal = Number(item.subtotal) || (price * quantity);

            return {
                transaction_id: transaction.id,
                product_id: item.product_id || item.id,
                product_name: item.name || item.product_name || 'Produk',
                product_image: item.image_url || item.image || '',
                quantity: quantity,
                price: price,
                subtotal: subtotal
            };
        });

        // 3. Simpan detail item transaksi
        const { error: detailError } = await db.from('transaction_details').insert(detailItems);
        if (detailError) throw new Error(`Gagal menyimpan detail transaksi: ${detailError.message}`);

        // 4. LOGIKA PENGURANGAN STOK PRODUK
        try {
            for (const item of items) {
                const productId = item.product_id || item.id;
                const qtyPurchased = Number(item.quantity) || 1;

                const { data: productData, error: fetchError } = await db
                    .from('products')
                    .select('stock')
                    .eq('id', productId)
                    .single();

                if (!fetchError && productData) {
                    const currentStock = productData.stock || 0;
                    const newStock = Math.max(0, currentStock - qtyPurchased);

                    await db.from('products')
                        .update({ stock: newStock })
                        .eq('id', productId);
                }
            }
        } catch (stockError) {
            Logger.error('Pengurangan Stok Error:', stockError.message);
        }

        // 5. Kosongkan keranjang belanja pengguna
        const { error: clearCartError } = await db.from('carts').delete().eq('user_id', userId);
        if (clearCartError) Logger.error('Clear Cart After Checkout Error:', clearCartError.message);

        return transaction;
    }

    async getUserTransactions(userId) {
        const { data, error } = await db
            .from('transactions')
            .select(`*, transaction_details(*)`)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data || [];
    }

    async getTransactionCounts(userId) {
        const { data, error } = await db.from('transactions').select('status').eq('user_id', userId);
        if (error) throw new Error(error.message);

        const counts = { pending: 0, diproses: 0, dikirim: 0, selesai: 0 };
        (data || []).forEach(trx => {
            const status = (trx.status || '').toUpperCase();
            if (status === 'PENDING') counts.pending++;
            else if (status === 'DIPROSES') counts.diproses++;
            else if (status === 'DIKIRIM') counts.dikirim++;
            else if (status === 'SELESAI') counts.selesai++;
        });

        return counts;
    }

    async updateTransactionStatus(transactionId, userId, status, paymentMethod, paymentChannel) {
        const updateData = { status: status };
        if (paymentMethod) updateData.payment_method = paymentMethod;
        if (paymentChannel) updateData.payment_channel = paymentChannel;

        const { data, error } = await db
            .from('transactions')
            .update(updateData)
            .eq('id', transactionId)
            .eq('user_id', userId) 
            .select('*')
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
}

module.exports = new TransaksiService();