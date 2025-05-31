import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { chatService } from './chat.service';

// const getAllChats = catchAsync(async (req, res) => {
//   const options = {
//     limit: Number(req.query.limit) || 10,
//     page: Number(req.query.page) || 1,
//   };
//   const { userId } = req.user;
//   // console.log('userId=====================', userId);
//   const filter: any = { participantId: userId };

//   const search = req.query.search;
//   // console.log('serch', search);

//   if (search && search !== 'null' && search !== '' && search !== undefined) {
//     const searchRegExp = new RegExp('.*' + search + '.*', 'i');
//     filter.name = searchRegExp;
//     // filter._id = search;
//   }
//   //  const { userId } = req.user;
//   // // console.log({ filter });
//   // // console.log({ options });

//   const result = await chatService.getChatByParticipantId(filter, options);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     //    meta: meta,
//     data: result,
//     message: 'chat list get successfully!',
//   });
// });


const createChat = catchAsync(async (req, res) => {
  const chatData = req.body;
  console.log('chatData', chatData);
  if (typeof chatData.participants === 'string') {
   
      chatData.participants = JSON.parse(chatData.participants);
    
  }else{
    chatData.participants = chatData.participants;
  }

   if (!Array.isArray(chatData.participants)) {
     return sendResponse(res, {
       statusCode: 400,
       success: false,
       message: 'Participants data should be an array',
       data: {},
     });
   }

  const chat = await chatService.createChat(chatData);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chat created successfully',
    data: chat,
  });
});

const getMyChatList = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await chatService.getMyChatList(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chat retrieved successfully',
    data: result,
  });
});

const getChatById = catchAsync(async (req, res) => {
  const result = await chatService.getChatById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chat retrieved successfully',
    data: result,
  });
});

const updateChat = catchAsync(async (req, res) => {
  const result = await chatService.updateChatList(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chat updated successfully',
    data: result,
  });
});

const deleteChat = catchAsync(async (req, res) => {
  const result = await chatService.deleteChatList(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Chat deleted successfully',
    data: result,
  });
});

export const chatController = {
  // getAllChats,
  createChat,
  getMyChatList,
  getChatById,
  updateChat,
  deleteChat,
};
