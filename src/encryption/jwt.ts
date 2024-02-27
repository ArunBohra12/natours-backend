import { SignOptions, sign, verify, decode } from 'jsonwebtoken';

/**
 * Function to generate JWT token
 */
export const generateToken = (
  payload: object,
  secret: string,
  options?: SignOptions,
): string => sign(payload, secret, options);

/**
 * Function to verify and decode JWT token
 */
export const verifyToken = (token: string, secret: string): unknown => {
  try {
    const decoded = verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Function to decode JWT without verifying
 */
export const decodeToken = <T>(token: string): T => decode(token) as T;