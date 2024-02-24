import { User, UserSignupDataType } from '../userModel';

interface UserSignupInterface {
  userWithEmailExists(email: string): Promise<boolean>;

  signup(data: UserSignupDataType): Promise<User>;
}

export default UserSignupInterface;
