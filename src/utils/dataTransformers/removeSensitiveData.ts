import { User } from '@api/v1/features/user/userModel';

const removeSensitiveDataFromUser = (user: User) => {
  delete user.password;
  delete user.created_at;
  delete user.account_status;
  delete user.is_verified;

  return user;
};

export default removeSensitiveDataFromUser;
