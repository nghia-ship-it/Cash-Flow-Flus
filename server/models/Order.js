import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, 
});

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },    
  paidAmount: { type: Number, default: 0 },         
  paymentMethod: { type: String, enum: ['CASH', 'TRANSFER', 'CARD'] },
  status: { type: String, enum: ['NEW', 'PROCESSING', 'DELIVERING', 'COMPLETED', 'CANCELLED'], default: 'NEW' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);