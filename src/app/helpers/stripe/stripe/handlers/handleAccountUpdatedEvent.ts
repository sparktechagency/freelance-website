
import Stripe from 'stripe';
import AppError from '../../../../error/AppError';
import { stripe } from '../../../../modules/payment/payment.service';

const User: any = '';

export const handleAccountUpdatedEvent = async (data: Stripe.Account) => {
     // Find the user by Stripe account ID
     const existingUser = await User.findOne({
          'stripeAccountInfo.accountId': data.id,
     });

     if (!existingUser) {
          throw new AppError(400, `User not found for account ID: ${data.id}`);
     }

     // Check if the onboarding is complete
     if (data.charges_enabled) {
          const loginLink = await stripe.accounts.createLoginLink(data.id);

          // Save Stripe account information to the user record
          await User.findByIdAndUpdate(existingUser?._id, {
               stripeAccountInfo: {
                    accountId: data.id,
                    loginUrl: loginLink.url,
               },
          });
     }
};
