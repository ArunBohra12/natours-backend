import bcrypt from 'bcrypt';

import {
  authenticationError,
  generalError,
  notFoundError,
  validationError,
} from '@core/errors/apiError';
import env from '@core/environment/environment';
import { generateToken } from '@encryption/jwt';
import removeSensitiveDataFromUser from '@utils/dataTransformers/removeSensitiveData';

import UserLoginInterface from './userLoginInterface';
import { User } from '../userModel';

type ValidatorType = {
  isEmail: (str: string) => boolean;
  isLength: (
    str: string,
    options?: {
      min?: number | undefined;
      max?: number | undefined;
    },
  ) => boolean;
};

const USER_JWT_EXPIRY_TIME = '90d';

class UserLoginInteractor {
  constructor(
    private userLoginEntity: UserLoginInterface,
    private validator: ValidatorType,
  ) {}

  private validate(email: string, password: string) {
    if (!email || !password) {
      throw validationError('Please provide both email and password');
    }

    if (!this.validator.isEmail(email)) {
      throw validationError('Please provide a valid email');
    }

    if (!this.validator.isLength(password, { min: 8 })) {
      throw validationError('Password length should be at least 8 characters');
    }
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    const isCorrectPassword = await bcrypt.compare(password, hash);
    return isCorrectPassword;
  }

  public generateLoginToken(data: string): string {
    return generateToken({ userId: data }, env.USER_JWT_TOKEN, {
      expiresIn: USER_JWT_EXPIRY_TIME,
    });
  }

  public async executeLoginWithEmail(
    email: string,
    password: string,
  ): Promise<{ userData: User; token: string }> {
    try {
      this.validate(email, password);

      const user = await this.userLoginEntity.getUserWithEmail(email);

      if (!user) {
        throw notFoundError('Invalid email or password');
      }

      if (!(await this.comparePassword(password, user.password))) {
        throw authenticationError('Invalid email or password');
      }

      const token = this.generateLoginToken(String(user.id));

      return {
        userData: removeSensitiveDataFromUser(user),
        token,
      };
    } catch (error) {
      throw generalError(error.messaeg);
    }
  }
}

export default UserLoginInteractor;
