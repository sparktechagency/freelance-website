import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    benefits: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
    type: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  },
  {
    timestamps: true, 
  },
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
