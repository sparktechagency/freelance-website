import { Types } from 'mongoose';

export type TReview = {
  courseId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  review: string;
};
