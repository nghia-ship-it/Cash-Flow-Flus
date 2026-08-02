import jsonwebtoken from 'jsonwebtoken';

// Trạm gác 1: Kiểm tra xem có vé (Token) hợp lệ không (Dùng cho cả Admin lẫn Nhân viên)
export const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1]; // Tách chữ Bearer ra, chỉ lấy cái mã loằng ngoằng
      
      // Kiểm tra vé giả hay thật
      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      
      req.user = decoded; // Dán thông tin user (id, role, name) vào gói hàng để các hàm sau xài
      next(); // Bấm nút cho ba-ri-e mở, cho phép đi tiếp vào API
    } catch (error) {
      res.status(401).json({ message: 'Token giả hoặc đã hết hạn! Yêu cầu đăng nhập lại!' });
    }
  } else {
    res.status(401).json({ message: 'Chưa đăng nhập mà đòi gọi API? Cút ra!' });
  }
};

// Trạm gác 2: Kiểm tra chức vụ (Chỉ cho phép Sếp - ADMIN)
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next(); // Mày là Sếp, mời qua!
  } else {
    res.status(403).json({ message: 'Cảnh báo: Tính năng này chỉ dành cho Sếp (ADMIN)!' });
  }
};