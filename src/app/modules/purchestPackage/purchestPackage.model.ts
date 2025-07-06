import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

const TPurchestPackageSchema = new Schema(
  {
    type: { type: String, required: true, enum: ['subscription', 'package'] },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    packageId: { type: Schema.Types.ObjectId, required: false, ref: 'Package' },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Subscription',
    },
    price: { type: Number, required: true },

    status: {
      type: String,
      required: true,
      enum: ['pending', 'running', 'completed'],
      default: 'pending',
    },
    endDate: { type: Date, required: false },
  },
  { timestamps: true },
);

const PurchestPackage = mongoose.model(
  'PurchestPackage',
  TPurchestPackageSchema,
);

export default PurchestPackage;
