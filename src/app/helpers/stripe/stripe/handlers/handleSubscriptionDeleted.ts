
// import Stripe from 'stripe';
// import { stripe } from '../../../../modules/payment/payment.service';
// import Subscription from '../../../../modules/subscription/subscription.model';
// import { User } from '../../../../modules/user/user.models';
// import AppError from '../../../../error/AppError';

// // const User:any = "";
// // const Subscription:any = "";

// export const handleSubscriptionDeleted = async (data: Stripe.Subscription) => {
//      // Retrieve the subscription from Stripe
//      const subscription = await stripe.subscriptions.retrieve(data.id);

//      // Find the current active or trialing subscription
//      const userSubscription = await Subscription.findOne({
//           customerId: subscription.customer,
//           status: { $in: ['active', 'trialing'] },
//      });

//      if (userSubscription) {
//           // Deactivate the subscription
//           await Subscription.findByIdAndUpdate(userSubscription._id, { status: 'cancel' }, { new: true });

//           // Find the user associated with the subscription
//           const existingUser = await User.findById(userSubscription?.userId);

//           if (existingUser) {
//                await User.findByIdAndUpdate(existingUser._id, { hasAccess: false, isSubscribed: false }, { new: true });
//           } else {
//                throw new AppError(404, `User not found.`);
//           }
//      } else {
//           throw new AppError(404, `Subscription not found.`);
//      }
// };
