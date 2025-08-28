import { model, Schema } from 'mongoose';
import { TPackage } from './package.interface';


const packageSchema = new Schema<TPackage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Images are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    benefits: {
      type: [String],
      required: true,
      default: [],
    },
    duration: {
      type: String,
      enum: ['1 month', '3 months', '6 months', '1 year'],
      required: true,
    },
    meetCount: {
      type: Number,
      required: true,
      min: 0,
    },
    meetDuration: {
      type: Number,
      required: true,
      min: 0,
    },
    productId: {
      type: String,
      required: true,
    },
    priceId: {
      type: String,
      required: true,
    },
    paymentLink: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Package = model<TPackage>('Package', packageSchema);

export default Package;
