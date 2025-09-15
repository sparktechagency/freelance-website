import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { supportmessageService } from './supportMessage.service';
import { ISupportChat } from './supportMessage.interface';
import supportModels from './supportMessage.model';
import AppError from '../../error/AppError';

const createChat = catchAsync(async (req, res) => {
  req.body.sender = req.user.userId;

  const result = await supportmessageService.createChat(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chat created successfully!!',
    data: result,
  });
});

const getMyChatList = catchAsync(async (req, res) => {
  const query = req.query;
  const userId = req.user.userId;
  const result = await supportmessageService.getMyChatList(userId, query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chat retrieved successfully',
    data: result,
  });
});

const createMessages = catchAsync(async (req, res) => {
  console.log('hit hoise');
  req.body.sender = req.user.userId;

  const updateFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  if (updateFiles?.image && updateFiles?.image?.length > 0) {
    req.body.image = updateFiles?.image[0]?.path?.replace(/^public[\\/]/, '');
  }

  console.log('req.body===ssssss', req.body);

  const result = await supportmessageService.createMessages(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message sent successfully!!',
    data: result,
  });
});

// Get all messages
const getAllMessages = catchAsync(async (req, res) => {
  const result = await supportmessageService.getAllMessages(req.query);
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
  const { userId } = req.user;
  const result = await supportmessageService.getMessagesByChatId(
    req.query,
    req.params.chatId,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

const getSingleMessages = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await supportmessageService.getSingleMessages(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Sinlge Messages retrieved successfully',
    data: result,
  });
});

// Update message
const updateMessages = catchAsync(async (req, res) => {
  const message = await supportModels.SupportMessage.findById(req.params.id);
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

  const result = await supportmessageService.updateMessages(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message updated successfully',
    data: result,
  });
});

//seen messages
const seenMessage = catchAsync(async (req, res) => {
  const chatList: ISupportChat | null =
    await supportModels.SupportChat.findById(req.params.chatId);
  if (!chatList) {
    throw new AppError(httpStatus.BAD_REQUEST, 'chat id is not valid');
  }

  const result = await supportmessageService.seenMessage(
    req.user.userId,
    req.params.chatId,
  );

  //   const user1 = chatList.participants[0];
  //   const user2 = chatList.participants[1];
  //   // //----------------------ChatList------------------------//
  //   const ChatListUser1 = await chatService.getMyChatList(user1.toString());

  //   const ChatListUser2 = await chatService.getMyChatList(user2.toString());

  //   const user1Chat = 'chat-list::' + user1;

  //   const user2Chat = 'chat-list::' + user2;

  //   io.emit(user1Chat, ChatListUser1);
  //   io.emit(user2Chat, ChatListUser2);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message seen successfully',
    data: result,
  });
});
// Delete message
const deleteMessages = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await supportmessageService.deleteMessages(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Message deleted successfully',
    data: result,
  });
});

export const supportMessageController = {
  createChat,
  getMyChatList,
  getMessagesByChatId,
  updateMessages,
  getSingleMessages,
  deleteMessages,
  createMessages,
  seenMessage,
  getAllMessages,
};
