// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import sendgrid from '@sendgrid/mail';
import logger from '../logger/logger.js';

class EmailHelper {
  constructor() {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(to) {
    const msg = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    try {
      const data = await sendgrid.send(msg);
      logger.info('Sent email successfully');
      logger.info(data);
    } catch (error) {
      logger.error('Error in sending email to the client');
      logger.error(error);
    }
  }
}

export default EmailHelper;
