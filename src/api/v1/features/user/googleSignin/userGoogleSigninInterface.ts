import { GoogleUserSignupDataType, User } from '../userModel';

export interface UserGoogleSigninInterface {
  checkIfUserWithEmailExists: (email: string) => Promise<User | false>;
  signupUserWithGoogle: (data: GoogleUserSignupDataType) => Promise<User>;
}
