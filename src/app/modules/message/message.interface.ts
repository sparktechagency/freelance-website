import { Types } from 'mongoose';

export interface IMessages {
  _id?: Types.ObjectId;
  id?: string;
  text?: string;
  image?: string;
  seen: boolean;
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
}
