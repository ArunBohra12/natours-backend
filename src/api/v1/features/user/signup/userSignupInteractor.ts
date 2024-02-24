import bcrypt from 'bcrypt';
import validator from 'validator';

import ApiError from '@core/errors/apiError';
import logger from '@core/logger/logger';
import { User, UserSignupDataType } from '../userModel';
import UserSignupInterface from './userSignupInterface';

class UserSignupInteractor {
  constructor(private userSignupInterface: UserSignupInterface) {}

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
      throw new ApiError(
        'Name, email and password are required',
        400,
        'ValidationError',
        'Operational',
      );
    }

    if (!validator.isLength(name, { min: 2 })) {
      throw new ApiError(
        'Name must be at least 2 characters',
        400,
        'ValidationError',
        'Operational',
      );
    }

    if (!validator.isEmail(email)) {
      throw new ApiError(
        'Please provide a valid email',
        400,
        'ValidationError',
        'Operational',
      );
    }

    if (!validator.isLength(password, { min: 8 })) {
      throw new ApiError(
        'Password must be at least 8 characters long',
        400,
        'ValidationError',
        'Operational',
      );
    }
  }

  private async checkIfEmailExists(email: string): Promise<boolean> {
    try {
      const userExists =
        await this.userSignupInterface.userWithEmailExists(email);
      return userExists;
    } catch (error) {
      const err = new ApiError(
        'Something went wrong. Please try again.',
        500,
        'InternalError',
        'Operational',
      );

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
      const err = new ApiError(
        'Something went wrong. Please try again.',
        500,
        'InternalError',
        'Operational',
      );

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
      throw new ApiError(
        'Account with that email already exists',
        400,
        'ValidationError',
        'Operational',
      );
    }

    const user = await this.signupUser({ name, email, password });
    user.password = undefined;
    user.created_at = undefined;
    user.account_status = undefined;
    user.is_verified = undefined;

    return user;
  }
}

export default UserSignupInteractor;
