import { QueryResult } from 'pg';

import getNewPool from '@config/db/dbConfig';
import UserSignupInterface from './userSignupInterface';
import { User, UserSignupDataType } from '../userModel';

class UserSignupEntity implements UserSignupInterface {
  async userWithEmailExists(email: string): Promise<boolean> {
    const result = await getNewPool().query(
      `SELECT * FROM users WHERE email = '${email}'`,
    );

    return result.rowCount > 0;
  }

  async signup({ name, email, password }: UserSignupDataType): Promise<User> {
    const result: QueryResult<User> = await getNewPool().query(
      'INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password, new Date()],
    );

    return result.rows[0];
  }
}

export default UserSignupEntity;
