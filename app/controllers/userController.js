/* eslint-disable import/prefer-default-export */

import User from '../models/userModel.js';

export const userSignup = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    status: 1,
    message: 'User created successfully',
    data: user,
  });
};
