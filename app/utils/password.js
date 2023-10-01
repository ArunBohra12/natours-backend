import bcrypt from 'bcrypt';

export const hashPassword = async (password, rounds = 12) => {
  const salt = await bcrypt.genSalt(rounds);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

export const comparePassword = async (password, hash) => {
  const isValid = await bcrypt.compare(password, hash);

  return isValid;
};
