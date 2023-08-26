import mongoose from 'mongoose';
import validator from 'validator';

const allowedOriginsSchema = new mongoose.Schema({
  urls: {
    type: [String],
    required: [true, 'Please provide an origin'],
    validator: [validator.isURL, 'Please provide a valid URL'],
  },
});

const AllowedOrigins = mongoose.model('OriginUrl', allowedOriginsSchema);

export default AllowedOrigins;
