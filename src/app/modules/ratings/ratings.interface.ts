import { Types } from 'mongoose';

export type TReview = {
  carId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  review: string;
};
