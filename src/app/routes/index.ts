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
import blogRouter from '../modules/blog/blog.route';
import contactUsRouter from '../modules/contactUs/contactUs.route';
import propertyRouter from '../modules/properties/properties.route';
import reservationsRouter from '../modules/reservations/reservations.route';
import carRouter from '../modules/car/car.route';
import reportRouter from '../modules/report/report.route';
import carBookingRouter from '../modules/carBooking/carBooking.route';
import facilityRouter from '../modules/facility/facility.route';

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
    path: '/blog',
    route: blogRouter,
  },

  {
    path: '/contact-us',
    route: contactUsRouter,
  },
  {
    path: '/properties',
    route: propertyRouter,
  },
  {
    path: '/reservations',
    route: reservationsRouter,
  },
  {
    path: '/car',
    route: carRouter,
  },
  {
    path: '/car-booking',
    route: carBookingRouter,
  },
  {
    path: '/facility',
    route: facilityRouter,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

