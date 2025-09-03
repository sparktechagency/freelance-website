
// import Stripe from 'stripe';
// import { User } from '../../../../modules/user/user.models';
// import AppError from '../../../../error/AppError';
// import { stripe } from '../../../../modules/payment/payment.service';
// import Package from '../../../../modules/package/package.model';
// import Subscription from '../../../../modules/subscription/subscription.model';
// import { notification } from 'paypal-rest-sdk';
// import { notificationService } from '../../../../modules/notification/notification.service';
// import { Payment } from '../../../../modules/payment/payment.model';
// import config from '../../../../config';
// import { Response } from 'express';
// import { startSession } from 'mongoose';



// const formatUnixToIsoUtc = (timestamp: number): string => {
//      const date = new Date(timestamp * 1000);
//      return date.toISOString().replace('Z', '+00:00');
// };

// export const handleSubscriptionCreated = async (data: Stripe.Subscription) => {
//       const session = await startSession();
//       session.startTransaction();
//      try {
//        const getAdmin = await User.findOne({ role: 'admin' }).session(
//          session,
//        );
//        if (!getAdmin) {
//          // throw new AppError(400, 'Admin not found!');
//          console.log('Admin not found!');
//          return;
//        }
//        const subscription = await stripe.subscriptions.retrieve(data.id);
//        console.log('subscription==123', subscription);
//        const customer = (await stripe.customers.retrieve(
//          subscription.customer as string,
//        )) as Stripe.Customer;
//        const priceId = subscription.items.data[0]?.price?.id;
//        const metadata = subscription.metadata;
//        const invoice = await stripe.invoices.retrieve(
//          subscription.latest_invoice as string,
//        );
//        console.log('invoice==123', invoice);
//        const trxId = invoice?.payment_intent as string;
//        const amountPaid = invoice?.total / 100;

//        // Extract other needed fields from the subscription object
//        // const remaining = subscription.items.data[0]?.quantity || 0;
//        // Convert Unix timestamp to Date
//        const currentPeriodStart = formatUnixToIsoUtc(
//          subscription.current_period_start,
//        );
//        const currentPeriodEnd = formatUnixToIsoUtc(
//          subscription.current_period_end,
//        );
//        const subscriptionId = subscription.id;
//        // Check if customer email is available
//        if (!customer?.email) {
//          // throw new   AppError(404, 'Customer email not found');
//          console.log('Customer email not found');
//          return;
//        }

//        const existingUser = await User.findById(metadata.userId).session(session);
//        if (!existingUser) {
//          console.log(`User not found for email: ${customer.email}`);
//          return;
//        }

//        const pricingPlan = await Package.findOne({ priceId }).session(session);
//        if (!pricingPlan) {
//          console.log(`Pricing plan not found for Price ID: ${priceId}`);
//          return;
//        }

//        const currentActiveSubscription = await Subscription.findOne({
//          userId: existingUser._id,
//          status: 'active',
//        }).session(session);

//        if (currentActiveSubscription) {
//          console.log('User already has an active subscription. Skipping.');
//          return;
//        }

//        const isTrialing = subscription.status === 'trialing';
//        const subscriptionStatus = isTrialing ? 'trialing' : 'active';

//        const subscriptionData:any = {
//          duration: pricingPlan.duration,
//          userId: existingUser._id,
//          packageId: pricingPlan._id,
//          status: subscriptionStatus,
//          price: amountPaid,
//          endDate: currentPeriodEnd,
//          meetCount: pricingPlan.meetCount,
//          meetDuration: pricingPlan.meetDuration,
//          stripeSubscriptionId: subscriptionId,
//        };

//        if (isTrialing && subscription.trial_start && subscription.trial_end) {
//          subscriptionData.trialStart = formatUnixToIsoUtc(
//            subscription.trial_start,
//          );
//          subscriptionData.trialEnd = formatUnixToIsoUtc(subscription.trial_end);
//        }

//        const newSubscription = new Subscription(subscriptionData);
//        await newSubscription.save({ session });

//        const paymentData = {
//          userId: existingUser._id,
//          subcriptionId: newSubscription._id,
//          amount: amountPaid,
//          method: 'stripe',
//          status: 'paid',
//          transactionId: trxId,
//        };
//        console.log('paymentData==', paymentData);

//        await Payment.create([paymentData], { session });

//        const userUpdateData: any = {
//          isSubscribed: true,
//          hasAccess: true,
//          subscriptionId: newSubscription._id,
//        };

//        if (isTrialing) {
//          userUpdateData.isFreeTrial = true;
//        } else {
//          userUpdateData.isFreeTrial = false;
//        }

//        await User.findByIdAndUpdate(existingUser._id, userUpdateData, {
//          session,
//          new: true,
//        });

//        const notificationData = {
//          userId: existingUser._id,
//          message: `A new subscription has been purchased for ${existingUser.fullName}`,
//          type: 'success',
//        };

//        await notificationService.createNotification(notificationData);

//        // Commit the transaction
//        await session.commitTransaction();
//      } catch (error) {
//        console.error('Error in handleSubscriptionCreated:', error);
//        await session.abortTransaction();
//        // return res.redirect(config.stripe.stripe_payment_cancel_url as string);
//        // throw new AppError(500, `Error in handleSubscriptionCreated: ${error instanceof Error ? error.message : error}`);
//        return;
//      } finally {
//        session.endSession();
//      }
// };
