
import Stripe from 'stripe';
import { User } from '../../../../modules/user/user.models';
import AppError from '../../../../error/AppError';
import { stripe } from '../../../../modules/payment/payment.service';
import Package from '../../../../modules/package/package.model';
import Subscription from '../../../../modules/subscription/subscription.model';
import { notification } from 'paypal-rest-sdk';
import { notificationService } from '../../../../modules/notification/notification.service';


const formatUnixToIsoUtc = (timestamp: number): string => {
     const date = new Date(timestamp * 1000);
     return date.toISOString().replace('Z', '+00:00');
};

export const handleSubscriptionCreated = async (data: Stripe.Subscription) => {
     try {
          const getAdmin = await User.findOne({ role: 'SUPER_ADMIN' });
          if (!getAdmin) {
               throw new AppError(400, 'Admin not found!');
          }
          const subscription = await stripe.subscriptions.retrieve(data.id);
          const customer = (await stripe.customers.retrieve(subscription.customer as string)) as Stripe.Customer;
          const priceId = subscription.items.data[0]?.price?.id;
          const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
          const trxId = invoice?.payment_intent as string;
          const amountPaid = invoice?.total / 100;

          // Extract other needed fields from the subscription object
          const remaining = subscription.items.data[0]?.quantity || 0;
          // Convert Unix timestamp to Date
          const currentPeriodStart = formatUnixToIsoUtc(subscription.current_period_start);
          const currentPeriodEnd = formatUnixToIsoUtc(subscription.current_period_end);
          const subscriptionId = subscription.id;
          // Check if customer email is available
          if (!customer?.email) {
               throw new AppError(403, 'No email found for the customer!');
          }

          if (customer?.email) {
               const existingUser = await User.findOne({ email: customer?.email });
               if (!existingUser) {
                    throw new AppError(404, `User not found for email: ${customer.email}`);
               }
               if (existingUser) {
                    const pricingPlan = await Package.findOne({ priceId });
                    if (!pricingPlan) {
                         throw new AppError(404, `Pricing plan not found for Price ID: ${priceId}`);
                    }

                    if (pricingPlan) {
                         // Check if the user already has an active subscription
                         const currentActiveSubscription = await Subscription.findOne({
                              userId: existingUser._id,
                              status: 'active',
                         });

                         if (currentActiveSubscription) {
                              throw new AppError(403, 'User already has an active subscription. Skipping.');
                         }

                         // Check if subscription is in trial period
                         const isTrialing = subscription.status === 'trialing';
                         const subscriptionStatus = isTrialing ? 'trialing' : 'active';
                         
                         // Prepare subscription data
                         const subscriptionData: any = {
                           duration: pricingPlan.duration,
                           userId: existingUser._id,
                           // customerId: customer?.id,
                           packageId: pricingPlan._id,
                           status: subscriptionStatus,
                           price: amountPaid,
                           trxId,
                           remaining,
                           currentPeriodStart,
                           currentPeriodEnd,
                           subscriptionId,
                           cancelAtPeriodEnd:
                             subscription.cancel_at_period_end || false,
                         };

                         // Add trial fields if in trial
                         if (isTrialing && subscription.trial_start && subscription.trial_end) {
                              subscriptionData.trialStart = formatUnixToIsoUtc(subscription.trial_start);
                              subscriptionData.trialEnd = formatUnixToIsoUtc(subscription.trial_end);
                         }
                         
                         // Create the new subscription
                         const newSubscription = new Subscription(subscriptionData);

                         // Save the new subscription to the database
                         await newSubscription.save();

                         // Update the user status based on trial period
                         const userUpdateData: any = {
                              isSubscribed: true,
                              hasAccess: true,
                              subscriptionId: newSubscription._id,
                         };

                         if (isTrialing) {
                              // User is in trial period
                              userUpdateData.isFreeTrial = true;
                              // userUpdateData.trialExpireAt = new Date(subscription.trial_end! * 1000);
                         } else {
                              // User has paid subscription
                              userUpdateData.isFreeTrial = false;
                              // userUpdateData.trialExpireAt = null;
                         }

                         await User.findByIdAndUpdate(
                              existingUser._id,
                              userUpdateData,
                              { new: true },
                         );

                         const notificationData = {
                           userId: existingUser._id,
                           message: `A new subscription has been purchase for ${existingUser.fullName}`,
                           type: 'success',
                         };

                         await notificationService.createNotification(
                           notificationData,
                         );

                    } else {
                         throw new AppError(404, `Pricing plan not found for Price ID: ${priceId}`);
                    }
               } else {
                    throw new AppError(404, `User not found for email: ${customer?.email}`);
               }
          } else {
               throw new AppError(404, 'No email found for the customer!');
          }
     } catch (error) {
          console.error('Error in handleSubscriptionCreated:', error);
          throw new AppError(500, `Error in handleSubscriptionCreated: ${error instanceof Error ? error.message : error}`);
     }
};
