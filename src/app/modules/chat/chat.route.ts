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
  auth(USER_ROLE.ADMIN, USER_ROLE.CREATOR),
  chatController.createChat,
);

chatRouter.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.CREATOR),
  chatController.updateChat,
);

chatRouter.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.CREATOR),
  chatController.deleteChat,
);

chatRouter.get(
  '/my-chat-list',
  auth(USER_ROLE.ADMIN, USER_ROLE.CREATOR),
  chatController.getMyChatList,
);

chatRouter.get(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.CREATOR),
  chatController.getChatById,
);

export default chatRouter;
