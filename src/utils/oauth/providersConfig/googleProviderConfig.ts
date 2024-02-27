import env from '@core/environment/environment';

export const {
  GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_CLIENT_SECRET,
  GOOGLE_AUTH_REDIRECT_URL,
} = env;

export const GOOGLE_AUTH_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];
