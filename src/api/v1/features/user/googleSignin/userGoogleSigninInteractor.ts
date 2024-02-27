import { ApiError, generalError } from '@core/errors/apiError';
import {
  getGoogleAuthTokens,
  getGoogleAuthUrl,
  getUserProfileDataFromGoogleIdToken,
} from '@utils/oauth/utils/googleAuthUtils';
import { generateToken } from '@encryption/jwt';
import env from '@core/environment/environment';
import removeSensitiveDataFromUser from '@utils/dataTransformers/removeSensitiveData';

import UserGoogleSigninEntity from './userGoogleSigninEntity';
import { GoogleUserSignupDataType, User } from '../userModel';

const USER_JWT_EXPIRY_TIME = '90d';

class UserGoogleSigninInteractor {
  constructor(private userGoogleSigninEntity: UserGoogleSigninEntity) {}

  public getAuthUrl(): string {
    return getGoogleAuthUrl();
  }

  private async checkGoogleUserExists(email: string): Promise<User | false> {
    const userExists =
      await this.userGoogleSigninEntity.checkIfUserWithEmailExists(email);
    return userExists;
  }

  private async addUserToDatabase({
    name,
    email,
    picture,
    refreshToken,
  }: GoogleUserSignupDataType): Promise<User> {
    const user = await this.userGoogleSigninEntity.signupUserWithGoogle({
      name,
      email,
      picture,
      refreshToken,
    });
    return user;
  }

  private async getLoginToken(data: string, accessToken: string) {
    return generateToken({ userId: data, accessToken }, env.USER_JWT_TOKEN, {
      expiresIn: USER_JWT_EXPIRY_TIME,
    });
  }

  public async executeLoginWithGoogle(
    code: string,
  ): Promise<{ token: string; userData: User }> {
    try {
      const accessTokens = await getGoogleAuthTokens(code);
      const { email, name, picture } = getUserProfileDataFromGoogleIdToken(
        accessTokens.id_token,
      );

      const userExists = await this.checkGoogleUserExists(email);

      if (userExists === false) {
        const user = await this.addUserToDatabase({
          name,
          email,
          picture,
          refreshToken: accessTokens.refresh_token,
        });

        const loginJwt = await this.getLoginToken(
          String(user.id),
          accessTokens.access_token,
        );

        return { token: loginJwt, userData: removeSensitiveDataFromUser(user) };
      }

      const loginJwt = await this.getLoginToken(
        String(userExists.id),
        accessTokens.access_token,
      );

      return {
        token: loginJwt,
        userData: removeSensitiveDataFromUser(userExists),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw generalError(error.message);
    }
  }
}

export default UserGoogleSigninInteractor;
