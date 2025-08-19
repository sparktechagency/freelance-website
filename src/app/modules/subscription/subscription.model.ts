
import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema(
  {
    type: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'running', 'completed'],
      default: 'pending',
    },
    endDate: { type: Date, required: false },
    meetCount: { type: Number, required: true },
    takeMeetCount: { type: Number, required: true, default: 0 },
    meetDuration: { type: Number, required: true, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);


const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
