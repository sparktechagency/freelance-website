import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { messageService } from './message.service';
import { IChat } from '../chat/chat.interface';
import Chat from '../chat/chat.model';
import AppError from '../../error/AppError';
import Message from './message.model';
import { chatService } from '../chat/chat.service';

// get all messages
// const getAllMessagess = catchAsync(async (req, res) => {
//   const options = {
//     page: req.query.page || 1,
//     limit: Number(req.query.limit) || 10,
//   };
//   const chatId = req.query.chatId;
//   // console.log({ chatIdController: chatId });
//   if (!chatId) {
//     throw new Error('ChatId is required in params');
//   }
//   const result = await messageService.getMessages(chatId, options);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     //    meta: meta,
//     data: result,
//     message: 'message get successful!',
//   });
// });

const createMessages = catchAsync(async (req, res) => {
  console.log('hit hoise')

  console.log('token userId', req.user.userId);
  const id = `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`;
  req.body.id = id;
  req.body.sender = req.user.userId;

  const updateFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
 

  if (updateFiles?.image && updateFiles?.image?.length > 0) {
    req.body.image = updateFiles?.image[0]?.path?.replace(/^public[\\/]/, '');
  }

   console.log('req.body===ssssss', req.body);

  const result = await messageService.createMessages(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

// Get all messages
const getAllMessages = catchAsync(async (req, res) => {
  const result = await messageService.getAllMessages(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// Get messages by chat ID
const getMessagesByChatId = catchAsync(async (req, res) => {
  const result = await messageService.getMessagesByChatId( req.query, req.params.chatId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

// Get message by ID
const getMessagesById = catchAsync(async (req, res) => {
  const result = await messageService.getMessagesById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message retrieved successfully',
    data: result,
  });
});

// Update message
const updateMessages = catchAsync(async (req, res) => {
  
    const message = await Message.findById(req.params.id);
    if (!message) {
      throw new AppError(httpStatus.NOT_FOUND, 'Message not found');
    }
    // const imageUrl = await uploadToS3({
    //   file: req.file,
    //   fileName: `images/messages/${message.chat}/${message.id}`,
    // });

    const updateFiles = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (updateFiles.image && updateFiles.image.length > 0) {
      req.body.image = updateFiles.image.map((file) => {
        return file.path.replace(/^public[\\/]/, ''); 
      });
    }
   

  const result = await messageService.updateMessages(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message updated successfully',
    data: result,
  });
});

//seen messages
const seenMessage = catchAsync(async (req, res) => {
  const chatList: IChat | null = await Chat.findById(req.params.chatId);
  if (!chatList) {
    throw new AppError(httpStatus.BAD_REQUEST, 'chat id is not valid');
  }

  const result = await messageService.seenMessage(
    req.user.userId,
    req.params.chatId,
  );

  const user1 = chatList.participants[0];
  const user2 = chatList.participants[1];
  // //----------------------ChatList------------------------//
  const ChatListUser1 = await chatService.getMyChatList(user1.toString());

  const ChatListUser2 = await chatService.getMyChatList(user2.toString());

  const user1Chat = 'chat-list::' + user1;

  const user2Chat = 'chat-list::' + user2;

  io.emit(user1Chat, ChatListUser1);
  io.emit(user2Chat, ChatListUser2);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message seen successfully',
    data: result,
  });
});
// Delete message
const deleteMessages = catchAsync(async (req, res) => {
  const result = await messageService.deleteMessages(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message deleted successfully',
    data: result,
  });
});

export const messageController = {
  // getAllMessages,
  getMessagesByChatId,
  getMessagesById,
  updateMessages,
  deleteMessages,
  createMessages,
  seenMessage,
  getAllMessages,
};
