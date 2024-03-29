// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sendgrid from '@sendgrid/mail';
import validator from 'validator';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
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
      logger.error("Can't render the ejs template");
      logger.error(JSON.stringify(error));
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
      if (process.env.NODE_ENV === 'development') {
        const data = await this.sendEmailDev();

        return data;
      }

      const data = await sendgrid.send(this.emailData);

      return {
        status: true,
        message: 'Email sent successfully',
        data,
      };
    } catch (error) {
      logger.error('Error in sending email to the client');
      logger.error(error);
      throw error;
    }
  }

  // This is only for dev environment where we send emails with mailtrap
  async sendEmailDev() {
    try {
      const transport = nodemailer.createTransport({
        host: process.env.MAILTRAP_EMAIL_HOST,
        port: process.env.MAILTRAP_EMAIL_PORT,
        auth: {
          user: process.env.MAILTRAP_EMAIL_USERNAME,
          pass: process.env.MAILTRAP_EMAIL_PASSWORD,
        },
      });

      const data = await transport.sendMail(this.emailData);

      if (data.rejected.length > 0) {
        throw data;
      }

      return {
        status: true,
        message: 'Mail sent successfully',
      };
    } catch (error) {
      logger.error('Unable to send mail with mailtrap');
      logger.error(JSON.stringify(error));

      return {
        status: false,
        err: error,
        message: 'Unable to send mail with mailtrap',
      };
    }
  }

  // Sends the email to notify about any error that occours in the application
  async sendErrorEmail(subject, errorTemplateData) {
    const data = { ...errorTemplateData };

    data.error = JSON.stringify(data.error, '', 2);
    data.date = new Date().toLocaleString('en-US');

    await this.setEmailData({
      to: process.env.ERROR_EMAIL_TO,
      subject: subject,
      templateName: 'appError.ejs',
      templateData: data,
    });

    await this.send();
  }
}

export default EmailHelper;
