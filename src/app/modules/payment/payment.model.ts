import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';


const paymentSchema = new Schema<TPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    method: {
      type: String,
      enum: ['stripe', 'paypal'],
      required: true,
      default: 'paypal',
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'Failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    subcriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subcription',
      required: false,
    },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      required: false,
    },
    isRefund: {
      type: Boolean,
      required: true,
      default: false,
    },
    transferAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentType: {
      type: String,
      enum: ['subscription', 'invoice', 'renewal'],
      required: true,
      default: 'subscription',
    },
  },
  { timestamps: true },
);






export const Payment = model<TPayment>('Payment', paymentSchema);
