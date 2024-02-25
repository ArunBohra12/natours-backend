import getNewPool from '@config/db/dbConfig';
import { QueryResult } from 'pg';
import { User } from '../userModel';
import UserLoginInterface from './userLoginInterface';

class UserLoginEntity implements UserLoginInterface {
  public async getUserWithEmail(email: string): Promise<User | undefined> {
    const result: QueryResult<User> = await getNewPool().query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    return result.rows[0];
  }
}

export default UserLoginEntity;
