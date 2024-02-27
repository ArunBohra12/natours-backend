import { QueryResult } from 'pg';

import getNewPool from '@config/db/dbConfig';
import { GoogleUserSignupDataType, User } from '../userModel';
import { UserGoogleSigninInterface } from './userGoogleSigninInterface';

class UserGoogleSigninEntity implements UserGoogleSigninInterface {
  public async checkIfUserWithEmailExists(email: string) {
    const result: QueryResult<User> = await getNewPool().query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    if (result.rowCount === 0) return false;

    return result.rows.at(0);
  }

  public async signupUserWithGoogle({
    name,
    email,
    picture,
    refreshToken,
  }: GoogleUserSignupDataType) {
    const dbPool = getNewPool();

    const result: QueryResult<User> = await dbPool.query(
      'INSERT INTO users (name, email, image, is_verified, google_signin_enabled, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, picture, true, true, new Date()],
    );
    dbPool.query(
      'INSERT INTO user_google_signin_details (user_id, refresh_token) VALUES ($1, $2)',
      [result.rows.at(0).id, refreshToken],
    );

    return result.rows.at(0);
  }
}

export default UserGoogleSigninEntity;
