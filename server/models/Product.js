import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  importPrice: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  stockQuantity: { type: Number, default: 0 },
  minStock: { type: Number, default: 5 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);