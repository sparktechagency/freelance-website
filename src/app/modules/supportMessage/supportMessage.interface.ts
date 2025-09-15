import { Types } from 'mongoose';

//support chat interface
export interface ISupportChat {
    _id?: Types.ObjectId;
    participants: Types.ObjectId[];
    status: 'accepted' | 'blocked';
}


//support message interface
export interface ISupportMessages {
  _id?: Types.ObjectId;
  sender: Types.ObjectId;
  message?: string;
  image?: string;
  seen: boolean;
  chatId: Types.ObjectId;
}
