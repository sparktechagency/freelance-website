import { model, Schema } from 'mongoose';
import { IServiceType } from './serviceType.interface';

const serviceTypeSchema = new Schema<IServiceType>(
  {
    name: { type: String, required: true },
    image: {
      type: String,
      required: [false, 'Images are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    isActive: { type: Boolean, default: false, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  },
);


export const ServiceType = model<IServiceType>('ServiceType', serviceTypeSchema);
