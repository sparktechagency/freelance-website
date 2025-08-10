
import { Router } from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { messageController } from './message.controller';

const messageRouter = Router();
// const storage = memoryStorage();
// const upload = multer({ storage });
const upload = fileUpload('./public/uploads/message');

messageRouter.get('/', messageController.getAllMessages);

messageRouter.post(
  '/send-messages',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  upload.fields([{ name: 'image', maxCount: 5 }]),
  messageController.createMessages,
);
messageRouter.post(
  '/send-messages',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  upload.fields([{ name: 'image', maxCount: 5 }]),
  messageController.createMessages,
);
messageRouter.post(
  '/pin-unpin-message/:messageId',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  messageController.pinUnpinMessage,
);
messageRouter.post(
  '/message-reaction/:messageId',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  messageController.messageReaction,
);

messageRouter.patch(
  '/seen/:chatId',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),

  messageController.seenMessage,
);

messageRouter.patch(
  '/update/:id',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  //   upload.single('image'),
  upload.fields([{ name: 'image', maxCount: 5 }]),
  //   parseData(),
  //   validateRequest(messagesValidation.updateMessageValidation),
  messageController.updateMessages,
);

messageRouter.get(
  '/my-messages/:chatId',
  messageController.getMessagesByChatId,
);

messageRouter.delete(
  '/:id',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  messageController.deleteMessages,
);

messageRouter.get(
  '/:id',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  messageController.getMessagesById,
);

messageRouter.get(
  '/',
  auth(USER_ROLE.ASSISTANT, USER_ROLE.DOCTOR, USER_ROLE.USER),
  messageController.getAllMessages,
);

export default messageRouter;
