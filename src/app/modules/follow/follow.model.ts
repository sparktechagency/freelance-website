import { model, Schema } from "mongoose";
import { TFollow } from "./follow.interface";

const followSchema = new Schema<TFollow>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followerUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Follow = model<TFollow>('Follow', followSchema);
export default Follow;