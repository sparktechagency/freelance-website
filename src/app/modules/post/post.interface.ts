import { Types } from "mongoose"

export type TPost = {
  userId: Types.ObjectId;
  description: string;
  // image: string
  likes: [Types.ObjectId];
  commentsCount: number;
  highlightsCount: number;
  likesCount: number;
  highlights: [Types.ObjectId];
  isDeleted: boolean;
};