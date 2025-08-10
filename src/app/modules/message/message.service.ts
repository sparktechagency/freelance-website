import mongoose, { Types } from 'mongoose';
import httpStatus from 'http-status';
import Message from './message.model';
import AppError from '../../error/AppError';
import { IMessages } from './message.interface';
import Chat from '../chat/chat.model';
import { chatService } from '../chat/chat.service';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.models';

// // Add a new message
// const addMessage = async (messageBody: any) => {
//   const newMessage = await Message.create(messageBody);
//   return await newMessage.populate('chat sender');
// };

// // Get messages by chat ID with pagination
// const getMessages = async (chatId: any, options = {}) => {
//   const { limit = 10, page = 1 }: { limit?: number; page?: number } = options;

//   try {
//     const totalResults = await Message.countDocuments({ chat: chatId });
//     const totalPages = Math.ceil(totalResults / limit);
//     const pagination = { totalResults, totalPages, currentPage: page, limit };

//     // console.log([chatId]);

//     const skip = (page - 1) * limit;
//     const chat = new mongoose.Types.ObjectId(chatId);

//     const messages = await Message.aggregate([
//       { $match: { chat: chat } },
//       { $sort: { createdAt: -1 } },
//       { $skip: skip },
//       { $limit: limit },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'sender',
//           foreignField: '_id',
//           as: 'sender',
//         },
//       },
//       { $unwind: '$sender' },
//       {
//         $lookup: {
//           from: 'chats',
//           localField: 'chat',
//           foreignField: '_id',
//           as: 'chatDetails',
//         },
//       },
//       { $unwind: '$chatDetails' },
//       {
//         $project: {
//           _id: 1,
//           chat: 1,
//           message: 1,
//           type: 1,
//           sender: {
//             _id: 1,
//             fullName: 1,
//             image: 1,
//           },
//           createdAt: 1,
//           updatedAt: 1,
//         },
//       },
//     ]);

//     // console.log('messages', messages);

//     return { messages, pagination };
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       'Failed to retrieve messages',
//     );
//   }
// };

// const getMessageById = async (messageId: Types.ObjectId) => {
//   return Message.findById(messageId).populate('chat');
// };

// // Delete a message by ID
// const deleteMessage = async (id: string) => {
//   const result = await Message.findByIdAndDelete(id);
//   if (!result) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Message not found');
//   }
//   return result;
// };

// // Delete messages by chat ID
// const deleteMessagesByChatId = async (chatId: string) => {
//   const result = await Message.deleteMany({ chat: chatId });
//   if (!result) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete messages');
//   }
//   return result;
// };

//------------------------------------------------------//

//------------------------------------------------------//

const createMessages = async (payload: IMessages) => {
  console.log('payload khela hobe', payload);

  const sender = await User.findById(payload.sender);
  // console.log('sender==', sender);

  if (!sender) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Sender is not found!!');
  }

  let chat;

  if (payload.chatId && !payload.replyTo) {
    console.log('payload.chatId', payload.chatId);
    chat = await Chat.findById(payload.chatId).select('participants');
    if (!chat) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found!');
    }
    // Derive receiver if not given
    if (!payload.receiver) {
      const receiver = chat.participants.find(
        (id) => id.toString() !== payload.sender.toString(),
      );
      if (!receiver) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Receiver not found!');
      }
    }
  } else if (payload.chatId && payload.replyTo) {
    console.log('payload.chatId', payload.chatId);
    chat = await Chat.findById(payload.chatId).select('participants');
    if (!chat) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found!');
    }
    const replyMessage = await Message.findById(payload.replyTo);
    if (!replyMessage) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Reply message not found!');
    }

    // Derive receiver if not given
    if (!payload.receiver) {
      const receiver = chat.participants.find(
        (id) => id.toString() !== payload.sender.toString(),
      );
      if (!receiver) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Receiver not found!');
      }
    }

    payload.replyTo = replyMessage._id;
  } else if (payload.receiver && !payload.chatId && !payload.replyTo) {
    console.log('payload.receiver', payload.receiver);
    const receiver = await User.findById(payload.receiver);
    if (!receiver) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Receiver is not found!!');
    }
    if (payload.sender.toString() === payload.receiver.toString()) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Sender and Receiver cannot be the same.',
      );
    }

    chat = await Chat.create({
      participants: [payload.sender, payload.receiver],
    });

    payload.chatId = chat._id;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Either chatId or receiver must be provided.',
    );
  }

  const result = await (
    await Message.create(payload)
  ).populate([
    {
      path: 'sender',
      select: 'name email image role _id phone',
    },
    {
      path: 'replyTo',
      select: 'image sender',
      populate: { path: 'sender', select: 'name email image role _id phone' },
    },
  ]);
  // console.log('result', result);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message creation failed!!');
  }

  if (io) {
    console.log('socket hit hoise!');
    const senderMessage = 'new-message::' + result.chatId.toString();
    console.log('senderMessage', senderMessage);

    io.emit(senderMessage, result);

     const receivers = chat.participants.filter(
       (id) => id.toString() !== payload.sender.toString(),
     );

     for (const userId of receivers) {
       const chatList = await chatService.getMyChatList(userId.toString());
       io.emit(`chat-list::${userId.toString()}`, chatList);
     }

     const senderChatList = await chatService.getMyChatList(
       payload.sender.toString(),
     );
     io.emit(`chat-list::${payload.sender.toString()}`, senderChatList);

  }

  return result;
};


const pinUnpinMessage = async (messageId: string) => {
  console.log('payload khela hobe', messageId);

  const message = await Message.findById(messageId);
  // console.log('sender==', sender);

  if (!message) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message is not found!!');
  }

  message.isPinned = !message.isPinned;
  const result = await message.save();


  return result;
};


const messageReaction = async (
  messageId: string,
  userId: string,
  reactionType: string,
) => {
  console.log('payload khela hobe', messageId);

  const message = await Message.findById(messageId);
  if (!message) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message is not found!!');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is not found!!');
  }

  const existingReaction = message.reactionUsers.find(
    (r: any) => r.userId.toString() === userId,
  );

  let updatedMessage;

  if (existingReaction) {
    if (existingReaction.reactionType === reactionType) {
      // Same reaction → remove it
      updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { $pull: { reactionUsers: { userId } } },
        { new: true },
      );
    } else {
      // Different reaction → update it
      updatedMessage = await Message.findOneAndUpdate(
        { _id: messageId, 'reactionUsers.userId': userId },
        { $set: { 'reactionUsers.$.reactionType': reactionType } },
        { new: true },
      );
    }
  } else {
    // No reaction → add new one
    updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { $push: { reactionUsers: { userId, reactionType } } },
      { new: true },
    );
  }

  return updatedMessage;
};


// Get all messages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllMessages = async (query: Record<string, any>) => {
  // console.log('query===', query);

  const chat = await Chat.findById(query.chatId);
  // console.log('chat', chat);

  if (!chat) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat is not found!!');
  }

  const messageModel = new QueryBuilder(
    Message.find().populate([
      {
        path: 'sender',
        select: 'name email image role _id phone ',
      },
      // {
      //   path: 'receiver',
      //   select: 'name email image role _id phone ',
      // },
      {
        path: 'replyTo',
        select: 'image sender',
        populate: { path: 'sender', select: 'name email image role _id phone' },
      },
    ]),
    query,
  )
    .filter()
    // .paginate()
    .sort()
    .fields();

  const message = await Message.find({ chatId: query.chatId });
  // console.log('message', message);
  // const getAllMessages = 'all-message::' + chat._id.toString();
  // io.emit(getAllMessages, message);

  const data = await messageModel.modelQuery;
  const meta = await messageModel.countTotal();
  return {
    meta,
    data,
  };
};

// Update messages
const updateMessages = async (id: string, payload: Partial<IMessages>) => {
  const result = await Message.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message update failed');
  }
  return result;
};

// Get messages by chat ID
// const getMessagesByChatId = async (chatId: string) => {
//   console.log('chatId', chatId);
//   const result = await Message.find({ chatId: chatId })
//     .sort({ createdAt: -1 });
//   return result;
// };
const getMessagesByChatId = async (
  query: Record<string, unknown>,
  chatId: string,
  userId: string,
) => {
  query.sort = '-createdAt';
  const TaskPostQuery = new QueryBuilder(
    Message.find({ chatId: chatId, deletedByUsers: { $ne: userId } })
      .populate({
        path: 'sender',
        select: 'fullName profile role',
      })
      .populate({
        path: 'replyTo',
        select: 'message',
      }),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const resultAll = await TaskPostQuery.modelQuery;
  console.log('resultAll', resultAll);

  const pinned = resultAll.filter((item) => item.isPinned === true);
  const result = resultAll.filter((item) => !item.isPinned);

  const newResult = {
    pinned: pinned,
    result: result,
  };

  const meta = await TaskPostQuery.countTotal();
  return { meta, newResult };
};



// Get message by ID
const getMessagesById = async (id: string) => {
  const result = await Message.findById(id).populate([
    {
      path: 'sender',
      select: 'name email image role _id phoneNumber ',
    },
    // {
    //   path: 'receiver',
    //   select: 'name email image role _id phoneNumber ',
    // },
    {
      path: 'replyTo',
      select: 'image sender',
      populate: { path: 'sender', select: 'name email image role _id phoneNumber' },
    }
  ]);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Message not found');
  }
  return result;
};

const deleteMessages = async (id: string, userId: string) => {
  const updatedMessage = await Message.findByIdAndUpdate(
    id,
    { $addToSet: { deletedByUsers: userId } },
    { new: true },
  );

  if (!updatedMessage) {
    throw new Error('Message not found');
  }

  return updatedMessage;
};


const seenMessage = async (userId: string, chatId: string) => {
  // console.log('userId', userId);
  // console.log('chatId', chatId);
  const chatIdObj = new mongoose.Types.ObjectId(chatId);
  const userIdObj = new mongoose.Types.ObjectId(userId);
  const messageIdList = await Message.aggregate([
    {
      $match: {
        chatId: chatIdObj,
        seen: false,
        sender: { $ne: userIdObj },
      },
    },
    { $group: { _id: null, ids: { $push: '$_id' } } },
    { $project: { _id: 0, ids: 1 } },
  ]);
  console.log('messageIdList', messageIdList);
  const unseenMessageIdList =
    messageIdList.length > 0 ? messageIdList[0].ids : [];
  console.log('unseenMessageIdList', unseenMessageIdList);
  const updateMessages = await Message.updateMany(
    { _id: { $in: unseenMessageIdList } },
    { $set: { seen: true } },
  );
  console.log('updateMessages', updateMessages);
  return updateMessages;
};

// Export all methods in the same format as the old structure
export const messageService = {
  // addMessage,
  // getMessageById,
  // getMessages,
  // deleteMessage,
  // deleteMessagesByChatId,
  createMessages,
  pinUnpinMessage,
  messageReaction,
  getAllMessages,
  getMessagesByChatId,
  getMessagesById,
  updateMessages,
  deleteMessages,
  seenMessage,
};
