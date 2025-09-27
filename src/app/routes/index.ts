import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import settingsRouter from '../modules/settings/setting.route';
import notificationRoutes from '../modules/notification/notification.route';
import paymentRouter from '../modules/payment/payment.route';
// import walletRouter from '../modules/wallet/wallet.route';
// import withdrawRouter from '../modules/withdraw/withdraw.route';
// import reviewRouter from '../modules/ratings/ratings.route';
import chatRouter from '../modules/chat/chat.route';
import messageRouter from '../modules/message/message.route';
// import favoriteProductRoutes from '../modules/favorite/favorite.route';
import faqRouter from '../modules/faq/faq.route';
import contactUsRouter from '../modules/contactUs/contactUs.route';
import reportRouter from '../modules/report/report.route';
import categoryRoutes from '../modules/category/category.route';
// import favoriteRoutes from '../modules/favorite/favorite.route';
import postRouter from '../modules/post/post.route';
import reportcommentsRouter from '../modules/reportComments/reportComments.route';
import freelancerInfoRouter from '../modules/freelancerInfo/freelancerInfo.route';
import projectRoutes from '../modules/project/project.route';
import serviceTypeRoutes from '../modules/serviceType/serviceType.route';
import jobsRoutes from '../modules/jobs/jobs.route';
import tenderRoutes from '../modules/tenders/tenders.route';
import packageRouter from '../modules/package/package.route';
import subcriptionRouter from '../modules/subscription/subscription.route';
import invoicesRouter from '../modules/invoices/invoices.route';
import supportMessageRouter from '../modules/supportMessage/supportMessage.route';

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
  //   path: '/favorite/saved',
  //   route: favoriteRoutes,
  // },
  // {
  //   path: '/wallet',
  //   route: walletRouter,
  // },
  {
    path: '/payment',
    route: paymentRouter,
  },
  // {
  //   path: '/withdraw',
  //   route: withdrawRouter,
  // },

  // {
  //   path: '/review',
  //   route: reviewRouter,
  // },
  {
    path: '/freelancer-info',
    route: freelancerInfoRouter,
  },
  {
    path: '/project',
    route: projectRoutes,
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
    path: '/contact-us',
    route: contactUsRouter,
  },
  {
    path: '/category',
    route: categoryRoutes,
  },
  {
    path: '/service-type',
    route: serviceTypeRoutes,
  },
  {
    path: '/jobs',
    route: jobsRoutes,
  },
  {
    path: '/tender',
    route: tenderRoutes,
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
    path: '/post',
    route: postRouter,
  },
  {
    path: '/report-comments',
    route: reportcommentsRouter,
  },
  {
    path: '/invoice',
    route: invoicesRouter,
  },
  {
    path: '/support-message',
    route: supportMessageRouter,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
