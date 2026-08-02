import express from 'express';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. API Đăng ký (Tạm thời dùng để mồi tài khoản Admin đầu tiên)
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    
    // Kiểm tra xem user có tồn tại chưa
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'Tài khoản này có người xài rồi mày ơi!' });

    // Băm mật khẩu ra cho an toàn
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword, name, role });
    await newUser.save();

    res.status(201).json({ message: 'Tạo tài khoản thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. API Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm tài khoản
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Sai tên đăng nhập rồi mày!' });

    // So sánh mật khẩu người dùng gõ với mật khẩu đã mã hóa trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu sai bét!' });

    // Tạo vé thông hành (Token) có thời hạn 1 ngày
    const token = jsonwebtoken.sign(
      { id: user._id, role: user.role, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Đăng nhập thành công rực rỡ!',
      token,
      user: { id: user._id, username: user.username, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Lấy danh sách tài khoản (Chỉ Sếp mới được xem)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    // Thêm .select('-password') để nó không trả về cục mật khẩu đã mã hóa, bảo mật tuyệt đối
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Sếp tạo tài khoản cho lính
router.post('/users', protect, adminOnly, async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'Tên đăng nhập này có người xài rồi!' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword, name, role });
    await newUser.save();
    
    res.status(201).json({ message: 'Tạo tài khoản nhân viên thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;