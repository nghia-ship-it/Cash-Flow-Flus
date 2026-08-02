import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'STAFF'], default: 'STAFF' } // Phân quyền
}, { timestamps: true });

export default mongoose.model('User', userSchema);