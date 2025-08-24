import { Types } from 'mongoose';

export type TfavoriteProduct = {
  type: 'course' | 'article';
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  articleId: Types.ObjectId;
};
