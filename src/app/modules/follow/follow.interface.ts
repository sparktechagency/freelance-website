import { Types } from "mongoose";

export type TFollow = {
  userId: Types.ObjectId;
  followerUserId: Types.ObjectId;
};
