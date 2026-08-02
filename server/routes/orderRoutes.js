// server/routes/orderRoutes.js
import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET: Lấy toàn bộ lịch sử đơn hàng để thống kê Dòng tiền
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng: ' + error.message });
  }
});

// POST: Tạo đơn hàng mới và trừ kho (Lúc thanh toán)
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

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
      items,
      totalAmount,
      paidAmount: totalAmount,
      paymentMethod: 'CASH',
      status: 'COMPLETED'
    });

    const savedOrder = await newOrder.save();

    for (let item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stockQuantity: -item.quantity } }
      );
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng: ' + error.message });
  }
});

export default router;