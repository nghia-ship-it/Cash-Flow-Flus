import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customerRoutes from './routes/customerRoutes.js'; 
import authRoutes from './routes/authRoutes.js';
import Order from './models/Order.js';
import Product from './models/Product.js';
import Customer from './models/Customer.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Đăng ký routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/dashboard/stats', protect, async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;

    const totalProducts = await Product.countDocuments({});
    const lowStockProducts = await Product.countDocuments({ $expr: { $lte: ["$stockQuantity", "$minStock"] } });
    const totalCustomers = await Customer.countDocuments({});

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockProducts,
      totalCustomers
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy thống kê: ' + error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy mượt mà tại cổng ${PORT}`);
});