import mongoose, { Types } from 'mongoose';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import Chat from '../chat/chat.model';
import { chatService } from '../chat/chat.service';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.models';
import { ISupportMessages } from './supportMessage.interface';
import supportModels from './supportMessage.model';

const createChat = async (payload: ISupportMessages) => {
  console.log('payload khela hobe', payload);

  const sender = await User.findById(payload.sender);

  if (!sender) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Sender is not found!!');
  }
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Admin is not found!!');
  }

  const chatPayload = {
    participants: [sender._id, admin._id],
  };

  const chat = await supportModels
    .SupportChat.findOne({
      participants: { $all: chatPayload.participants },
    });

  if (chat) {
    return chat;
  } else {
    const chat = await supportModels.SupportChat.create({
      participants: chatPayload.participants,
    });
    return chat;
  }
};

const getMyChatList = async (
  userId: string,
  query?: Record<string, unknown>,
) => {
  let chats;
  if (query && query.search && query.search !== '') {
    const searchRegExp = new RegExp('.*' + query.search + '.*', 'i');
    const matchingUsers = await User.find({ fullName: searchRegExp }).select(
      '_id',
    );

    const matchingUserIds = matchingUsers.map((u) => u._id);

    chats = await supportModels.SupportChat.find({
      $and: [{ participants: { $in: matchingUserIds } }],
    }).populate({
      path: 'participants',
      select: 'fullName email image role',
    });
  } else {
    chats = await supportModels.SupportChat.find({}).populate({
      path: 'participants',
      select: 'fullName email image role',
    });
  }

  console.log('chats==', chats);

  if (!chats) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat list not found');
  }

  const data = [];
  for (const chatItem of chats) {
    const chatId = chatItem?._id;
    const message: any = await supportModels.SupportMessage.findOne({
      chatId: chatId,
    }).sort({
      updatedAt: -1,
    });

    console.log('message', message);

    const unreadMessageCount =
      await supportModels.SupportMessage.countDocuments({
        chatId: chatId,
        seen: false,
        sender: { $ne: userId },
      });
    console.log('unreadMessageCount', unreadMessageCount);

    // if (message) {
    //   data.push({ chat: chatItem, message: message, unreadMessageCount });
    // }

    const defaultMessage = {
      _id: '',
      message: '',
      image: '',
      seen: false,
      chatId: '',
      createdAt: null,
      updatedAt: null,
      __v: '',
    };

    data.push({
      chat: chatItem,
      message: message ? message : defaultMessage,
      unreadMessageCount: message ? unreadMessageCount : 0,
    });
  }
  data.sort((a, b) => {
    const dateA = (a.message && a.message.createdAt) || 0;
    const dateB = (b.message && b.message.createdAt) || 0;
    return dateB - dateA;
  });
  console.log('data.length', data.length);

  console.log('data', data);

  return data.length ? data: chats;
};

const createMessages = async (payload: ISupportMessages) => {
  console.log('payload khela hobe', payload);

  const sender = await User.findById(payload.sender);
  // console.log('sender==', sender);

  if (!sender) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Sender is not found!!');
  }
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Admin is not found!!');
  }

  const chatPayload = {
    participants: [sender._id, admin._id],
  };

  const chat = await supportModels.SupportChat.findOne({
    participants: { $all: chatPayload.participants },
  }).populate(['participants']);
  console.log('chat 0000', chat);

  const messagePayload: any = {
    sender: sender._id,
    message: payload.message,
  };

  if (payload.image) {
    messagePayload.image = payload.image;
  }

  if (chat) {
    messagePayload.chatId = chat._id;
  } else {
    console.log('chatPayload');
    const chat = await supportModels.SupportChat.create({
      participants: chatPayload.participants,
    });
    messagePayload.chatId = chat._id;
  }

  const result = await supportModels.SupportMessage.create(messagePayload);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message creation failed!!');
  }

  if (io) {
    console.log('socket hit hoise!');
    const senderMessage = 'new-support-message::' + result.chatId.toString();
    console.log('senderMessage', senderMessage);

    io.emit(senderMessage, result);
  }

  return result;
};



const getAllMessages = async (query: Record<string, any>) => {
  // console.log('query===', query);

  const chat = await supportModels.SupportChat.findById(query.chatId);
  // console.log('chat', chat);

  if (!chat) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat is not found!!');
  }

  const messageModel = new QueryBuilder(
    supportModels.SupportMessage.find().populate([
      {
        path: 'sender',
        select: 'name email image role _id phone ',
      },
    ]),
    query,
  )
    .filter()
    // .paginate()
    .sort()
    .fields();

  const message = await supportModels.SupportMessage.find({
    chatId: query.chatId,
  });
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


const getSingleMessages = async (id: string, ) => {
  const result = await supportModels.SupportMessage.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Message is not found!!');
  }
  return result;
};

// Update messages
const updateMessages = async (
  id: string,
  payload: Partial<ISupportMessages>,
) => {
  const result = await supportModels.SupportMessage.findByIdAndUpdate(
    id,
    payload,
    { new: true },
  );
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
) => {
  query.sort = '-createdAt';
  const TaskPostQuery = new QueryBuilder(
    supportModels.SupportMessage.find({
      chatId: chatId,
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

  const meta = await TaskPostQuery.countTotal();
  return { meta, resultAll };
};

const deleteMessages = async (id: string) => {
  const updatedMessage = await supportModels.SupportMessage.findByIdAndDelete(
    id,
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
  const messageIdList = await supportModels.SupportMessage.aggregate([
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
  const updateMessages = await supportModels.SupportMessage.updateMany(
    { _id: { $in: unseenMessageIdList } },
    { $set: { seen: true } },
  );
  console.log('updateMessages', updateMessages);
  return updateMessages;
};

export const supportmessageService = {
  createChat,
  getMyChatList,
  createMessages,
  getAllMessages,
  getMessagesByChatId,
  updateMessages,
  getSingleMessages,
  deleteMessages,
  seenMessage,
};
