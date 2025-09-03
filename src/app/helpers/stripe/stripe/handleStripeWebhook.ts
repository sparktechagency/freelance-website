// import { Request, Response } from 'express';
// import Stripe from 'stripe';
// import colors from 'colors';
// import { handleSubscriptionCreated, handleSubscriptionDeleted, handleSubscriptionUpdated, handleTrialWillEnd } from './handlers';
// import config from '../../../config';
// import { stripe } from '../../../modules/payment/payment.service';


// const handleStripeWebhook = async (req: Request, res: Response) => {
//      try {
//           // Extract Stripe signature and webhook secret
//           const signature = req.headers['stripe-signature'] as string;
//           const webhookSecret = config.WEBHOOK as string;

//           let event: Stripe.Event | undefined;

//           // Verify the event signature
//           try {
//                event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
//           } catch (error) {
//                // logger.error(colors.red(`Webhook signature verification failed: ${error}`));
//                res.status(400).json({ 
//                     error: 'Webhook signature verification failed' 
//                });
//                return;
//           }

//           if (!event) {
//                // logger.error(colors.red('Invalid event received'));
//                res.status(400).json({ 
//                     error: 'Invalid event received' 
//                });
//                return;
//           }

//           // Log the received event
//           // logger.info(colors.blue(`Received webhook event: ${event.type} [${event.id}]`));

//           // Extract event data and type
//           const data = event.data.object as Stripe.Subscription | Stripe.Account;
//           const eventType = event.type;
          
//           // Handle the event based on its type
//           try {
//                switch (eventType) {
//                     case 'customer.subscription.created':
//                          await handleSubscriptionCreated(data as Stripe.Subscription);
//                          break;

//                     case 'customer.subscription.updated':
//                          await handleSubscriptionUpdated(data as Stripe.Subscription);
//                          break;

//                     case 'customer.subscription.deleted':
//                          await handleSubscriptionDeleted(data as Stripe.Subscription);
//                          break;

//                     case 'customer.subscription.trial_will_end':
//                          await handleTrialWillEnd(data as Stripe.Subscription);
//                          break;

//                     default:
//                          // logger.warn(colors.yellow(`Unhandled event type: ${eventType}`));
//                          console.log(
//                            colors.yellow(`Unhandled event type: ${eventType}`),
//                          );
//                }
               
//                // logger.info(colors.green(`Successfully processed webhook event: ${eventType} [${event.id}]`));
//                console.log( colors.green(`Successfully processed webhook event: ${eventType} [${event.id}]`),);
//           } catch (error) {
//                // logger.error(colors.red(`Error handling event ${eventType}: ${error}`));
//                console.log(colors.red(`Error handling event ${eventType}: ${error}`));
//                // Still return 200 to acknowledge receipt, but log the error
//                // Stripe will retry failed webhooks automatically
//           }

//           res.sendStatus(200);
//      } catch (error) {
//           // logger.error(colors.red(`Webhook handler error: ${error}`));
//           console.log(colors.red(`Webhook handler error: ${error}`));
//           res.status(400).json({ 
//                error: 'Internal server error' 
//           });
//      }
// };

// export default handleStripeWebhook;
