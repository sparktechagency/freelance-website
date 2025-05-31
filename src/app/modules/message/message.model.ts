import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const messageSchema = new Schema(
  {
    text: {
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
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    chatId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  },
);
const Message =  model('Message', messageSchema);

export default Message;
