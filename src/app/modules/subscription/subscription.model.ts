import mongoose from 'mongoose';
import { TSubscription } from './subscription.interface';

const subscriptionSchema = new mongoose.Schema<TSubscription>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    price: { type: Number, required: true },
    image: {
      type: String,
      required: [true, 'Images are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one File is required',
      },
    },
    benefits: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
    type: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  },
  {
    timestamps: true,
  },
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription
