import mongoose from 'mongoose';
import Chat from './chat.model';
import { IChat } from './chat.interface';
import { User } from '../user/user.models';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import Message from '../message/message.model';

// Create a new chat (Equivalent to `createChat` in your old code)
// export const createChat = async (user: any, participant: any) => {
//   const newChat = new Chat({
//     participants: [user, participant],
//   });
//   const savedChat = await newChat.save();
//   return await savedChat.populate({
//     path: 'participants',
//     match: { _id: { $ne: user } },
//   });
// };

// Get chat by ID
// export const getChatById = async (id: string) => {
//   return await Chat.findById(id);
// };

// Get chat by participants
// export const getChatByParticipants = async (user: any, participant: any) => {
//   const chat = await Chat.findOne({
//     participants: { $all: [user, participant] },
//   }).populate({
//     path: 'participants',
//     match: { _id: { $ne: user } },
//   });
//   return chat;
// };

// // Get chat details by participant ID
// export const getChatDetailsByParticipantId = async (
//   user: any,
//   participant: any,
// ) => {
//   const chat = await Chat.findOne({
//     participants: { $all: [user, participant] },
//   });
//   return chat;
// };

// Delete chat by ID (Equivalent to `deleteChatList` in your old code)
// export const deleteChatList = async (chatId: any) => {
//   return await Chat.findByIdAndDelete(chatId);
// };


// export const getChatByParticipantId = async (filters: any, options: any) => {
//   // // console.log(filters, options);
//   // console.log('filters ----', filters);
//   try {
//     const page = Number(options.page) || 1;
//     const limit = Number(options.limit) || 10;
//     const skip = (page - 1) * limit;

//     const participantId = new mongoose.Types.ObjectId(filters.participantId);
//     // console.log('participantId===', participantId);

//     const name = filters.name || '';

//     // console.log({ name });

//     const allChatLists = await Chat.aggregate([
//       { $match: { participants: participantId } },
//       {
//         $lookup: {
//           from: 'messages',
//           let: { chatId: '$_id' },
//           pipeline: [
//             { $match: { $expr: { $eq: ['$chat', '$$chatId'] } } },
//             { $sort: { createdAt: -1 } },
//             { $limit: 1 },
//             { $project: { message: 1, createdAt: 1 } },
//           ],
//           as: 'latestMessage',
//         },
//       },
//       { $unwind: { path: '$latestMessage', preserveNullAndEmptyArrays: true } },
//       { $sort: { 'latestMessage.createdAt': -1 } },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'participants',
//           foreignField: '_id',
//           as: 'participants',
//         },
//       },

//       {
//         $addFields: {
//           participants: {
//             $map: {
//               input: {
//                 $filter: {
//                   input: '$participants',
//                   as: 'participant',
//                   cond: { $ne: ['$$participant._id', participantId] },
//                 },
//               },
//               as: 'participant',
//               in: {
//                 _id: '$$participant._id',
//                 fullName: '$$participant.fullName',
//                 image: '$$participant.image',
//               },
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           participants: {
//             $elemMatch: {
//               fullName: { $regex: name },
//             },
//           },
//         },
//       },
//       {
//         $addFields: {
//           participant: { $arrayElemAt: ['$participants', 0] },
//         },
//       },
//       {
//         $project: {
//           latestMessage: 1,
//           groupName: 1,
//           type: 1,
//           groupAdmin: 1,
//           image: 1,
//           participant: 1,
//         },
//       },
//       {
//         $facet: {
//           totalCount: [{ $count: 'count' }],
//           data: [{ $skip: skip }, { $limit: limit }],
//         },
//       },
//     ]);

//     // console.log('allChatLists');
//     // console.log(allChatLists);

//     const totalResults =
//       allChatLists[0]?.totalCount?.length > 0
//         ? allChatLists[0]?.totalCount[0]?.count
//         : 0;

//     const totalPages = Math.ceil(totalResults / limit);
//     const pagination = { totalResults, totalPages, currentPage: page, limit };

//     // return { chatList: allChatLists, pagination };
//     return { chatList: allChatLists[0]?.data, pagination };
//     // return allChatLists;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };



// Get participant lists (Equivalent to `getMyChatList` in your old code)
// export const getMyChatList = async (userId: any) => {
//   const myId = new mongoose.Types.ObjectId(userId);
//   const result = await Chat.aggregate([
//     { $match: { participants: { $in: [myId] } } },
//     { $unwind: '$participants' },
//     { $match: { participants: { $ne: myId } } },
//     {
//       $group: {
//         _id: null,
//         participantIds: { $addToSet: '$participants' },
//       },
//     },
//   ]);
//   return result;
// };

//-----------------------------------------------------------//
//-----------------------------------------------------------//


const createChat = async (payload: IChat) => {
  console.log('chat payload', payload);
  const user1 = await User.findById(payload?.participants[0]);

  if (!user1) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid user');
  }

  const user2 = await User.findById(payload?.participants[1]);

  if (!user2) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid user');
  }


  const alreadyExists = await Chat.findOne({
    participants: { $all: payload.participants },
  }).populate(['participants']);

  if (alreadyExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat already exists');
  }

  const result = Chat.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat creation failed');
  }
  return result;
};


const addParticipant = async (payload: {
  chatId: string;
  participantId: string;
}) => {
  console.log('add participant payload', payload);
  const chat = await Chat.findById(payload?.chatId);

  if (!chat) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat not found!!');
  }

  const participant = await User.findById(payload?.participantId);

  if (!participant) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'participant not found!!');
  }


  const participantId = new mongoose.Types.ObjectId(payload?.participantId); 
  

  const alreadyExists = await Chat.findOne({
    _id: chat._id,
    participants: { $all: participantId },
  });
  console.log(' alreadyExists', alreadyExists);

  if(alreadyExists){
    return alreadyExists;
  }else{

  chat.participants.push(participantId);
  await chat.save();

  return chat;
  }

};


const pinUnpinChat = async (
  chatId: string
) => {
  console.log('add participant payload', chatId);
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat not found!!');
  }

  chat.isPinned = !chat.isPinned;
  await chat.save();

  return chat;
  
};


// Get my chat list
const getMyChatList = async (
  userId: string,
  query?: Record<string, unknown>,
) => {
  console.log('*****', userId);

  let chats;
  if (query && query.search && query.search !== '') {
    const searchRegExp = new RegExp('.*' + query.search + '.*', 'i');
    const matchingUsers = await User.find({ fullName: searchRegExp }).select(
      '_id',
    );
    const matchingUserIds = matchingUsers.map((u) => u._id);

    chats = await Chat.find({
      $and: [
        { participants: { $all: [userId] } },
        { participants: { $in: matchingUserIds } },
        { deletedByUsers: { $ne: userId } },
      ],
    }).populate({
      path: 'participants',
      select: 'fullName email profile role _id phone',
      match: { _id: { $ne: userId } },
    });
  } else {
    chats = await Chat.find({
      participants: { $all: userId },
      deletedByUsers: { $ne: userId },
    }).populate({
      path: 'participants',
      select: 'fullName email profile role _id phone',
      match: { _id: { $ne: userId } },
    });
  }


  if (!chats) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat list not found');
  }

  console.log('chats==', chats);

  const data = [];
  for (const chatItem of chats) {
    console.log('chatItem==', chatItem);
    const chatId = chatItem?._id;
    const message: any = await Message.findOne({ chatId: chatId }).sort({
      updatedAt: -1,
    });


    const unreadMessageCount = await Message.countDocuments({
      chatId: chatId,
      seen: false,
      sender: { $ne: userId },
    });

    // if (message) {
    //   data.push({ chat: chatItem, message: message, unreadMessageCount });
    // }

    const defaultMessage = {
      _id: '',
      text: '',
      image: '',
      seen: false,
      sender: '',
      receiver: '',
      chatId: '',
      replyTo: null,
      createdAt: null,
      updatedAt: null,
      isPinned: false,
      reactionUsers: [],
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


  // Separate pinned and unpinned
  const pinned = data.filter((item) => item.chat.isPinned === true);
  const unpinned = data.filter((item) => !item.chat.isPinned);
  const newResult = { pinned, unpinned };

  // return data.length ? data: chats;
  return newResult;
};

// Get chat by ID
const getChatById = async (id: string) => {
  const result = await Chat.findById(id).populate({
    path: 'participants',
    select: 'fullName email image role _id phone ',
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found');
  }
  return result;
};

// Update chat list
const updateChatList = async (id: string, payload: Partial<IChat>) => {
  const result = await Chat.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found');
  }
  return result;
};



const deleteChatList = async (id: string, userId: string) => {
  const chat = await Chat.findById(id);
  if (!chat) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found');
  }
  await Chat.findByIdAndUpdate(
    id,
    { $addToSet: { deletedByUsers: userId } }, 
    { new: true },
  );

 await Message.updateMany(
   { chatId: id },
   { $addToSet: { deletedByUsers: userId } },
 );
  

  return chat;
};

export const chatService = {
  createChat,
  addParticipant,
  pinUnpinChat,
  getChatById,
  // getChatByParticipants,
  // getChatDetailsByParticipantId,
  // getChatByParticipantId,
  deleteChatList,
  getMyChatList,
  updateChatList,
};
