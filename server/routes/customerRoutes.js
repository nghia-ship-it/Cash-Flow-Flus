import express from 'express';
import Customer from '../models/Customer.js';

const router = express.Router();

// Lấy danh sách khách hàng
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thêm khách hàng mới
router.post('/', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi: Số điện thoại này đã tồn tại!' });
  }
});

export default router;