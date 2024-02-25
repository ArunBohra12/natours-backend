import { User } from '../userModel';

interface UserLoginInterface {
  getUserWithEmail(email: string): Promise<User | undefined>;
}

export default UserLoginInterface;
