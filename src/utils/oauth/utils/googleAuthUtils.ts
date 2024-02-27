import { decodeToken } from '@encryption/jwt';
import GoogleAuthProvider from '../providers/googleProvider';

export type GoogleIdTokenType = {
  email: string;
  name: string;
  picture: string;
  iat: number;
  exp: number;
};

export const getGoogleAuthUrl = (): string => {
  const googleProvider = new GoogleAuthProvider();
  return googleProvider.getAuthUrl();
};

export const getGoogleAuthTokens = async (code: string) => {
  const googleProvider = new GoogleAuthProvider();
  const tokens = await googleProvider.getAccessTokens(code);
  return tokens;
};

export const getUserProfileDataFromGoogleIdToken = (
  token: string,
): GoogleIdTokenType => decodeToken<GoogleIdTokenType>(token);
