import { model, Schema, Types } from 'mongoose';
import { ITenders } from './tenders.interface';

const tendersSchema = new Schema<ITenders>(
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
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    description: { type: String, required: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    serviceTypeId: { type: String, required: true },
    serviceTypeName: { type: String, required: true },
    status: { type: String, enum:['pending', 'running', 'completed'], required: true, default: 'pending' },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  },
);

export const Tender = model<ITenders>('Tender', tendersSchema);
