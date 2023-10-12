import mongoose from 'mongoose';
import validator from 'validator';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['viewer', 'editor', 'admin'],
    default: 'viewer',
  },
  loginLink: {
    type: String,
    default: null,
  },
  loginLinkExpiry: {
    type: Date,
    default: null,
  },
});

const Admin = mongoose.Model('Admin', adminSchema);

export default Admin;
