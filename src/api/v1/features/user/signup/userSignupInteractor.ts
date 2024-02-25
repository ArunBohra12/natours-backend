import bcrypt from 'bcrypt';

import removeSensitiveDataFromUser from '@utils/dataTransformers/removeSensitiveData';
import { validationError, generalError } from '@core/errors/apiError';
import logger from '@core/logger/logger';

import { User, UserSignupDataType } from '../userModel';
import UserSignupInterface from './userSignupInterface';

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

class UserSignupInteractor {
  constructor(
    private userSignupInterface: UserSignupInterface,
    private validator: ValidatorType,
  ) {}

  private validate({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    if (!name || !email || !password) {
      throw validationError('Name, email and password are required');
    }

    if (!this.validator.isEmail(email)) {
      throw validationError('Please pvovide a valid email');
    }

    if (!this.validator.isLength(password, { min: 8 })) {
      throw validationError('Password must be at least 8 characters long');
    }
  }

  private async checkIfEmailExists(email: string): Promise<boolean> {
    try {
      const userExists =
        await this.userSignupInterface.userWithEmailExists(email);
      return userExists;
    } catch (error) {
      const err = generalError();
      logger.error(err.serialize());

      throw err;
    }
  }

  private async createPasswordHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async signupUser({
    name,
    email,
    password,
  }: UserSignupDataType): Promise<User> {
    try {
      const hashedPassword = await this.createPasswordHash(password);
      const user = await this.userSignupInterface.signup({
        name,
        email,
        password: hashedPassword,
      });
      return user;
    } catch (error) {
      const err = generalError();
      logger.error(err.serialize());

      throw err;
    }
  }

  public async execute({
    name,
    email,
    password,
  }: UserSignupDataType): Promise<User> {
    this.validate({ name, email, password });
    const userExists = await this.checkIfEmailExists(email);
    if (userExists) {
      throw validationError('Account with that email already exists');
    }

    const user = await this.signupUser({ name, email, password });
    return removeSensitiveDataFromUser(user);
  }
}

export default UserSignupInteractor;
