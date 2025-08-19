import { Types } from "mongoose";


// export type TComment = {
//     userId: Types.ObjectId;
//     message: string;
//     likes: [Types.ObjectId];
//     commentsReply: [Types.ObjectId];
// }


export type TComments = {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  likes: [Types.ObjectId];
  commentsReply: Types.ObjectId[];
};





