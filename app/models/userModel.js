import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
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
});

userSchema.pre('save', async function (next) {
  if (!this.isNew || !this.password) {
    next();
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
  }

  next();
});

const User = mongoose.model('User', userSchema);

export default User;
