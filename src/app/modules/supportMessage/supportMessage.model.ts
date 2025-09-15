import mongoose, { model, Schema, Document } from 'mongoose';
import { ISupportChat, ISupportMessages } from './supportMessage.interface';

const chatSchema = new Schema<ISupportChat>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
      },
    ],
    status: {
      type: String,
      enum: ['accepted', 'blocked'],
      default: 'accepted',
    },
  },
  {
    timestamps: true,
  },
);

const SupportChat = model('SupportChat', chatSchema);

const supportMessagesSchema = new Schema<ISupportMessages>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    message: {
      type: String,
      required: false,
      // maxlength: 1000, // Optional length limit
    },
    image: {
      type: String,
      required: false,
    },
    seen: {
      type: Boolean,
      required: true,
      default: false,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SupportChat', 
      index: true, 
    },
  },
  {
    timestamps: true,
  },
);

const SupportMessage = model<ISupportMessages>(
  'SupportMessage',
  supportMessagesSchema,
);

export default { SupportChat, SupportMessage };
