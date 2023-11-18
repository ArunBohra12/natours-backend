import mongoose from 'mongoose';
import validator from 'validator';

const customerSchema = new mongoose.Schema(
  {
    stripeCustomerId: {
      type: String,
      required: [true, 'Please provide a valid customer ID'],
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validator: validator.isEmail,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
