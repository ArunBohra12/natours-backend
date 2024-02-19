/**
 * Type to set data for sending email with sendgrid
 */
export type EmailData = {
  from: {
    email: string;
    name?: string;
  };
  to: Array<{ email: string; name?: string }>;
  html?: string;
  subject: string;
  text: string;
};
