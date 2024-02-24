export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  image: string;
  account_status: boolean;
  is_verified: boolean;
  created_at: Date;
};

export type UserSignupDataType = {
  name: string;
  email: string;
  password: string;
};
