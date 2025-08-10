import { Types } from 'mongoose';

export interface IMessages {
  _id?: Types.ObjectId;
  id?: string;
  message?: string;
  image?: string;
  seen: boolean;
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  replyTo: Types.ObjectId;
  receiver: Types.ObjectId;
  isPinned: boolean;
  reactionUsers?: {
    userId: Types.ObjectId;
    reactionType: 'like' | 'love' | 'thumbs_up' | 'laugh' | 'angry' | 'sad';
  }[];
  deletedByUsers: Types.ObjectId[];
} 
