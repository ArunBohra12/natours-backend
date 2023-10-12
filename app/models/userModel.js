import mongoose from 'mongoose';
import validator from 'validator';
import { hashPassword } from '../utils/password.js';

const userSchema = new mongoose.Schema({
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
  googleAccount: {
    type: {
      googleId: {
        type: String,
        required: true,
      },
      refreshToken: {
        type: String,
        required: true,
      },
    },
    required: false,
    select: false,
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
    select: false,
  },
  verificationData: {
    type: {
      otp: String,
      expiresAt: Date,
    },
    deafault: null,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isNew || !this.password) {
    next();
  }

  if (this.isModified('password')) {
    const hash = hashPassword(this.password);

    this.password = hash;
  }

  next();
});

const User = mongoose.model('User', userSchema);

export default User;
