import { model, Schema } from 'mongoose';
import { TReview } from './ratings.interface';

const reviewSchema = new Schema<TReview>(
  {
    carId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Car',
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Review = model<TReview>('Review', reviewSchema);
