// server/routes/orderRoutes.js
import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';

const router = express.Router();

// GET: Lấy toàn bộ lịch sử đơn hàng
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng: ' + error.message });
  }
});

// POST: Tạo đơn hàng mới, trừ kho và cập nhật lịch sử mua hàng cho khách (CHỈ GIỮ LẠI DUY NHẤT 1 HÀM NÀY)
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, customer } = req.body;

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          message: `Món "${product?.name || 'Vô danh'}" không đủ hàng!` 
        });
      }
    }

    const orderCode = `ORD-${Date.now().toString().slice(-6)}`;

    const newOrder = new Order({
      orderCode,
      customer: customer || null,
      items,
      totalAmount,
      paidAmount: totalAmount,
      paymentMethod: 'CASH',
      status: 'COMPLETED'
    });

    const savedOrder = await newOrder.save();

    // Trừ tồn kho sản phẩm
    for (let item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stockQuantity: -item.quantity } }
      );
    }

    // Cập nhật chi tiêu cho khách hàng nếu có chọn
    if (customer) {
      await Customer.findByIdAndUpdate(
        customer,
        { 
          $inc: { 
            totalPurchases: 1,
            totalSpent: totalAmount
          } 
        }
      );
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng: ' + error.message });
  }
});

export default router;