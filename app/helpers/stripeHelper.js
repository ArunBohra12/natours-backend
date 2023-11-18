import Stripe from 'stripe';
import validator from 'validator';
import Customer from '../models/customerModel.js';
import { STRIPE_CURRENCY } from '../../config/constants.js';
import logger from '../logger/logger.js';

class StripeHelper {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async customerAlreadyExists(email) {
    if (!email || validator.isEmail(email)) {
      throw new Error('Please provide valid data');
    }

    try {
      const customer = await Customer.find({ email });

      if (!customer) return false;

      return true;
    } catch (error) {
      logger.error(JSON.stringify(error));
      return false;
    }
  }

  async createCustomer(name, email) {
    if (!name || !email || validator.isEmail(email)) {
      return [
        false,
        {
          message: 'Please provide valid data',
        },
      ];
    }

    try {
      const alreadyExist = await this.customerAlreadyExists(email);

      if (alreadyExist) return;

      await this.stripe.customers.create({
        name,
        email,
        payment_method: 'card',
        invoice_settings: {
          default_payment_method: 'card',
        },
      });
    } catch (error) {
      logger.error(JSON.stringify(error));
    }
  }

  async createCheckoutSession(tourDetails, userDetails) {
    try {
      const checkoutSession = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              product_data: {
                name: tourDetails.name,
                description: tourDetails.summary,
                images: [],
                metadata: {
                  tourId: tourDetails._id,
                },
              },
              currency: STRIPE_CURRENCY,
              unit_amount: tourDetails.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        currency: STRIPE_CURRENCY,
        customer_email: userDetails.email,
        success_url: `${process.env.CLIENT_APP_BASE_URL}/payment/success`,
        cancel_url: `${process.env.CLIENT_APP_BASE_URL}/payment/cancel`,
      });

      return [true, checkoutSession];
    } catch (error) {
      logger.error(JSON.stringify(error));

      return [
        false,
        {
          message: 'Unable to create a checkout session. Please try again later.',
        },
      ];
    }
  }

  constructWebhookEvent(requestBody, stripeSignature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        requestBody,
        stripeSignature,
        process.env.TOUR_BOOKING_SUCCESS_WEBHOOK
      );

      return [true, event];
    } catch (err) {
      return [false, `Webhook Error: ${err.message}`];
    }
  }
}

export default StripeHelper;
