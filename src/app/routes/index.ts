import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import settingsRouter from '../modules/settings/setting.route';
import notificationRoutes from '../modules/notification/notification.route';
import paymentRouter from '../modules/payment/payment.route';
// import walletRouter from '../modules/wallet/wallet.route';
import withdrawRouter from '../modules/withdraw/withdraw.route';
import reviewRouter from '../modules/ratings/ratings.route';
import chatRouter from '../modules/chat/chat.route';
import messageRouter from '../modules/message/message.route';
// import favoriteProductRoutes from '../modules/favorite/favorite.route';
import faqRouter from '../modules/faq/faq.route';
import reportRouter from '../modules/report/report.route';
import creatorRouter from '../modules/creator/creator.route';
import packageRouter from '../modules/package/package.route';
import blogRouter from '../modules/blog/blog.route';
import subcriptionRouter from '../modules/subscription/subscription.route';
import hireCreatorRouter from '../modules/hireCreator/hireCreator.route';
import purchestRouter from '../modules/purchestPackage/purchestPackage.route';
import uploadVideoRouter from '../modules/uploadVideo/uploadVideo.route';
import assignTaskCreatorRouter from '../modules/assignTaskCreator/assignTaskCreator.route';
import contactUsRouter from '../modules/contactUs/contactUs.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },

  {
    path: '/setting',
    route: settingsRouter,
  },
  {
    path: '/notification',
    route: notificationRoutes,
  },
  // {
  //   path: '/favorite-product',
  //   route: favoriteProductRoutes,
  // },
  // {
  //   path: '/wallet',
  //   route: walletRouter,
  // },
  {
    path: '/payment',
    route: paymentRouter,
  },
  {
    path: '/withdraw',
    route: withdrawRouter,
  },

  {
    path: '/review',
    route: reviewRouter,
  },
  {
    path: '/chat',
    route: chatRouter,
  },
  {
    path: '/message',
    route: messageRouter,
  },

  {
    path: '/faq',
    route: faqRouter,
  },

  {
    path: '/report',
    route: reportRouter,
  },
  {
    path: '/creator',
    route: creatorRouter,
  },
  {
    path: '/hire-creator',
    route: hireCreatorRouter,
  },
  {
    path: '/package',
    route: packageRouter,
  },
  {
    path: '/subscription',
    route: subcriptionRouter,
  },
  {
    path: '/blog',
    route: blogRouter,
  },
  {
    path: '/purchest',
    route: purchestRouter,
  },
  {
    path: '/upload-video',
    route: uploadVideoRouter,
  },
  {
    path: '/assign-task-creator',
    route: assignTaskCreatorRouter,
  },
  {
    path: '/contact-us',
    route: contactUsRouter,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

