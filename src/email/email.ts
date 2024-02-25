// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import path from 'node:path';

import ejs from 'ejs';
import validator from 'validator';
import nodemailer from 'nodemailer';
import { Options as NodemailerOptions } from 'nodemailer/lib/mailer';
import sendGrid from '@sendgrid/mail';

import env from '@core/environment/environment';
import logger from '@core/logger/logger';
import { internalError } from '@core/errors/apiError';
import { EmailData } from './email.types';

class Email {
  private templatesDirPath = path.resolve(__dirname, 'templates');

  private emailData: EmailData;

  constructor() {
    if (env.NODE_ENV === 'production') {
      sendGrid.setApiKey(env.SENDGRID_API_KEY);
    }
  }

  private async renderEmailTemplate(
    templateName: string,
    templateData: unknown,
  ): Promise<string> {
    try {
      const template = await ejs.renderFile(
        path.join(this.templatesDirPath, templateName),
        { data: JSON.stringify(templateData, null, 2) },
      );

      return template;
    } catch (error) {
      logger.error('Can not render the ejs template in email service', {
        error: JSON.stringify(error),
      });

      const err = internalError(
        'Can not render the ejs template in email service',
        'Functional',
        JSON.stringify(error),
      );

      throw err;
    }
  }

  public async setEmailData(
    emailData: Partial<Pick<EmailData, 'from'>> &
      Omit<EmailData, 'from'> & {
        templateName: string;
        templateData?: unknown;
      },
  ) {
    const {
      to,
      subject,
      templateName,
      templateData = {},
      text = '',
    } = emailData;

    if (!to.length) {
      to.forEach((item) => {
        if (!validator.isEmail(item.email)) {
          throw new Error('Please pvovide valid data for the email');
        }
      });
    }

    const msg: EmailData = {
      from: {
        name: 'Natours',
        email: process.env.EMAIL_FROM,
      },
      to,
      subject,
      text,
      html: await this.renderEmailTemplate(templateName, templateData),
    };

    this.emailData = msg;

    return this;
  }

  /**
   * This is only for dev environment where we send emails with mailtrap
   */
  private async sendMailDev() {
    try {
      const transport = nodemailer.createTransport({
        host: env.MAILTRAP_HOST,
        port: Number(env.MAILTRAP_PORT),
        auth: {
          user: env.MAILTRAP_USERNAME,
          pass: env.MAILTRAP_PASSWORD,
        },
      });

      const mailData: NodemailerOptions = {
        from: `${this.emailData.from.name} <${this.emailData.from.email}>`,
        sender: this.emailData.from.email,
        to: this.emailData.to.map((el) => el.email),
        subject: this.emailData.subject,
        text: this.emailData.text,
        html: this.emailData.html,
      };
      const data = await transport.sendMail(mailData);

      if (data.rejected.length > 0) {
        const err = internalError(
          'Can not send email with mailtrap',
          'Functional',
          JSON.stringify(data),
        );

        throw err;
      }

      return {
        status: true,
        message: 'Mail sent successfully',
      };
    } catch (error) {
      logger.error('Unable to send mail with mailtrap', JSON.stringify(error));

      const err = internalError(
        'Unable to send mail with mailtrap',
        'Functional',
        JSON.stringify(error),
      );

      throw err;
    }
  }

  public async sendMail() {
    if (!this.emailData) {
      throw internalError('No data for the email message', 'Functional');
    }

    try {
      if (env.NODE_ENV === 'development') {
        const data = await this.sendMailDev();
        return data;
      }

      const data = await sendGrid.send(this.emailData);

      return {
        status: true,
        message: 'Email sent successfully',
        data,
      };
    } catch (error) {
      const err = internalError(
        'Can not render the ejs template in email service',
        'Functional',
        JSON.stringify(error),
      );
      err.addErrorMetadata(JSON.stringify(error));

      throw err;
    }
  }

  /**
   * Sends the email to notify about any error that occours in the application
   */
  public async sendErrorEmail(
    subject: string,
    errorTemplateData: Record<string, unknown>,
    effectedModule = '',
  ) {
    const data = { ...errorTemplateData };

    data.error = JSON.stringify(data.error, null, 2);
    data.date = new Date().toLocaleString('en-US');
    data.effectedModule = effectedModule;

    await this.setEmailData({
      to: [
        {
          email: env.EMAIL_FROM,
        },
      ],
      subject,
      text: 'An error occoured',
      templateName: 'errorEmail.ejs',
      templateData: data,
    });

    await this.sendMail();
  }
}

export default Email;
