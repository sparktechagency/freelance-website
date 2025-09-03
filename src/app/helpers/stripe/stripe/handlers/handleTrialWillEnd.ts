
// import Stripe from 'stripe';
// import { stripe } from '../../../../modules/payment/payment.service';
// import { User } from '../../../../modules/user/user.models';
// import AppError from '../../../../error/AppError';
// import Package from '../../../../modules/package/package.model';



// export const handleTrialWillEnd = async (data: Stripe.Subscription) => {
//      try {
//           // Retrieve the subscription from Stripe
//           const subscription = await stripe.subscriptions.retrieve(data.id);

//           // Retrieve the customer associated with the subscription
//           const customer = (await stripe.customers.retrieve(subscription.customer as string)) as Stripe.Customer;

//           if (customer?.email) {
//                // Find the user by email
//                const existingUser = await User.findOne({ email: customer?.email });

//                if (!existingUser) {
//                     throw new AppError(400, `User not found for email: ${customer?.email}`);
//                }

//                // Extract price ID from subscription items
//                const priceId = subscription.items.data[0]?.price?.id;

//                // Find the pricing plan by priceId
//                const pricingPlan = await Package.findOne({ priceId });
//                if (!pricingPlan) {
//                     throw new AppError(400, `Pricing plan with Price ID: ${priceId} not found!`);
//                }

//                // Update user to indicate trial is ending soon
//                await User.findByIdAndUpdate(
//                     existingUser._id,
//                     {
//                          isFreeTrial: true,
//                          trialExpireAt: new Date(subscription.trial_end! * 1000),
//                          // You can add additional fields here for trial ending notifications
//                     },
//                     { new: true },
//                );

//                // Optional: Send notification to user about trial ending
//                // You can implement email notification or in-app notification here
//                console.log(`Trial will end for user ${existingUser.email} on ${new Date(subscription.trial_end! * 1000)}`);

//           } else {
//                throw new AppError(400, 'No email found for the customer!');
//           }
//      } catch (error) {
//           if (error instanceof AppError) {
//                throw error;
//           } else {
//                throw new AppError(500, 'Error handling trial will end event');
//           }
//      }
// };