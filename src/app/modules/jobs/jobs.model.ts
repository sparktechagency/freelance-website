import { model, Schema, Types } from 'mongoose';
import { IJobs } from './jobs.interface';

const jobsSchema = new Schema<IJobs>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
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
    jobType: { type: String, required: true },
    websiteLink: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    serviceTypeId: { type: String, required: true },
    serviceTypeName: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  },
);

export const Jobs = model<IJobs>('Jobs', jobsSchema);
