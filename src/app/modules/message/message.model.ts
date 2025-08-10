import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    message: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },

    seen: {
      type: Boolean,
      default: false,
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    chatId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Chat',
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    reactionUsers: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: false,
        },
        reactionType: {
          type: String,
          enum: ['like', 'love', 'thumbs_up', 'laugh', 'angry', 'sad'],
          required: false,
        },
      },
    ],
    deletedByUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Message = model('Message', messageSchema);

export default Message;
