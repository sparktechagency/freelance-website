import mongoose, { Schema, Document } from 'mongoose';
import { Types } from 'mongoose';

// Define the invoice schema
const invoiceSchema = new Schema({
  invoiceType: {
    type: String,
    enum: ['service', 'tender'],
    required: true,
  },
  freelancerUserId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientUserId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenderId: {
    type: Types.ObjectId,
    ref: 'Tender',
    required: false,
  },
  serviceType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'delivered', 'declined', 'completed'],
    required: true,
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    required: true,
    default: 'pending',
  },
  deliveryMessage: {
    type: String,
    required: false,
  },
  deliveryFiles: {
    type: [String],
    required: false,
  },
  extendDate: {
    type: Date,
    required: false,
    default: null,
  },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
