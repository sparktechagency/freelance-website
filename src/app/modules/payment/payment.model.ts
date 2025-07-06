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
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: false,
    },
    type:{
      type:String,
      required:true,
      enum: ['regular', 'renewal'],
      default:"regular"
    },
    isRefund:{
      type:Boolean,
      required:true,
      default:false
    }
  },
  { timestamps: true },
);






export const Payment = model<TPayment>('Payment', paymentSchema);
