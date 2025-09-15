import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { supportMessageController } from './supportMessage.controller';

const supportMessageRouter = Router();
const upload = fileUpload('./public/uploads/supportMessage');

supportMessageRouter.get('/', supportMessageController.getAllMessages);

supportMessageRouter.post(
  '/create-chat',
  auth(USER_ROLE.FREELANCER),
  supportMessageController.createChat,
);
supportMessageRouter.get(
  '/my-chat-list',
  auth(USER_ROLE.ADMIN),
  supportMessageController.getMyChatList,
);
supportMessageRouter.post(
  '/send-messages',
  auth(USER_ROLE.ADMIN, USER_ROLE.FREELANCER),
  upload.fields([{ name: 'image', maxCount: 5 }]),
  supportMessageController.createMessages,
);

supportMessageRouter.patch(
  '/seen/:chatId',
  auth(USER_ROLE.ADMIN, USER_ROLE.FREELANCER),
  supportMessageController.seenMessage,
);

supportMessageRouter.patch(
  '/update/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.FREELANCER),
  upload.fields([{ name: 'image', maxCount: 5 }]),
  supportMessageController.updateMessages,
);

supportMessageRouter.get(
  '/my-messages/:chatId',
  auth(USER_ROLE.ADMIN, USER_ROLE.FREELANCER),
  supportMessageController.getMessagesByChatId,
);

supportMessageRouter.get('/:id', supportMessageController.getSingleMessages);
supportMessageRouter.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.FREELANCER),
  supportMessageController.deleteMessages,
);

supportMessageRouter.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.FREELANCER),
  supportMessageController.getAllMessages,
);

export default supportMessageRouter;
