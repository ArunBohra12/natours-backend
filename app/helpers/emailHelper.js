// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import sendgrid from '@sendgrid/mail';
import logger from '../logger/logger.js';

class EmailHelper {
  constructor() {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  setEmailData(to, subject, text) {
    // if (!to || !subject || !text) {}

    const msg = {
      from: process.env.EMAIL_FROM,
      to: 'arunbohra33@gmail.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    this.emailData = msg;
  }

  async sendEmail() {
    this.setEmailData();

    if (!this.emailData || Object.keys(this.emailData).length === 0) {
      logger.error('Please add data for the email.');
      return;
    }

    try {
      const data = await sendgrid.send(this.emailData);
      logger.info('Sent email successfully');
      logger.info(data);
    } catch (error) {
      logger.error('Error in sending email to the client');
      logger.error(error);
    }
  }
}

export default EmailHelper;
