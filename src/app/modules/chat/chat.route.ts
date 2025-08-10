/** @format */

import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { chatController } from './chat.controller';


const chatRouter = Router();

// chatRouter.get(
//   '/',
//   auth(USER_ROLE.TASKER, USER_ROLE.POSTER),
//   chatController.getAllChats,
// );

chatRouter.post(
  '/',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  chatController.createChat,
);
chatRouter.post(
  '/add-participant',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  chatController.addParticipant,
);
chatRouter.post(
  '/pin-unpin-message/:chatId',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  chatController.pinUnpinChat,
);

chatRouter.patch(
  '/:id',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  chatController.updateChat,
);

chatRouter.delete(
  '/:id',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  chatController.deleteChat,
);

chatRouter.get(
  '/my-chat-list',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  chatController.getMyChatList,
);

chatRouter.get(
  '/:id',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  chatController.getChatById,
);

export default chatRouter;
