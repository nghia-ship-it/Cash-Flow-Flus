import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // Số điện thoại là duy nhất
  address: { type: String },
  totalPurchases: { type: Number, default: 0 }, // Tổng số lần mua hàng
  totalSpent: { type: Number, default: 0 },     // Tổng tiền đã đốt vào quán
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);