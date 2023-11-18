/* eslint-disable import/prefer-default-export */
import logger from '../logger/logger.js';
import catchAsync from '../utils/catchAsync.js';
import StripeHelper from '../helpers/stripeHelper.js';
import { STRIPE_EVENTS } from '../../config/constants.js';
import AppError from '../error/appError.js';
import EmailHelper from '../helpers/emailHelper.js';

export const tourBookingSuccess = catchAsync(async (req, res, next) => {
  const stripeSignature = req.headers['stripe-signature'];

  const stripe = new StripeHelper();
  const webhookEvent = stripe.constructWebhookEvent(req.body, stripeSignature);

  if (webhookEvent.at(0) === false) {
    logger.error(JSON.stringify(webhookEvent.at(1)));
    return next(new AppError('Sorry, something went wrong', 400));
  }

  let status;
  let email;

  switch (webhookEvent.at(1).type) {
    case STRIPE_EVENTS.CHECKOUT_SESSION_SUCCESS:
      break;

    default:
      status = false;
      logger.error(`Unhandled event type ${webhookEvent.at(1).type}`);

      email = new EmailHelper();
      await email.sendErrorEmail('Error: uploading images', {
        type: 'Error',
        message: 'An unhandled event type triggered',
        description: '',
        component: {
          name: 'Tour Booking Webhook',
          file: 'app/webhooks/tourWebhooks.js',
        },
        error: {
          webhookEvent: webhookEvent.at(1),
        },
      });
  }

  if (status === false) {
    return next(new AppError('Sorry, something went wrong', 400));
  }

  return res.status(200).json({
    status: true,
    recieved: true,
  });
});
