// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sendgrid from '@sendgrid/mail';
import validator from 'validator';
import ejs from 'ejs';
import logger from '../logger/logger.js';

class EmailHelper {
  constructor() {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

    this.templatesDirPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)), // current file directory
      '..',
      'templates',
      'emails'
    );
  }

  async _renderEmailTemplate(templateName, data) {
    try {
      const template = await ejs.renderFile(path.join(this.templatesDirPath, templateName), data);

      return template;
    } catch (error) {
      logger.info("Can't render the ejs template");
      logger.error(error);
      throw error;
    }
  }

  async setEmailData(emailData) {
    const { to, subject, templateName, templateData = {}, text = '' } = emailData;

    if (!to || !subject || !validator.isEmail(to)) {
      throw new Error('Please pvovide valid data for the email');
    }

    const msg = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
    };

    if (text) {
      msg.text = text;
    }

    if (templateName) {
      msg.html = await this._renderEmailTemplate(templateName, templateData);
    }

    this.emailData = msg;

    return this;
  }

  async send() {
    if (!this.emailData || Object.keys(this.emailData).length === 0) {
      logger.error('Please add data for the email.');
      return;
    }

    try {
      const data = await sendgrid.send(this.emailData);
      return { message: 'Email sent successfully', data };
    } catch (error) {
      logger.error('Error in sending email to the client');
      logger.error(error);
      throw error;
    }
  }
}

export default EmailHelper;
