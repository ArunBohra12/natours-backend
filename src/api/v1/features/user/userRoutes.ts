import { Router } from 'express';
import userSignupController from './signup/userSignupController';

const userRouter = Router();

userRouter.post('/signup-with-email', userSignupController);

export default userRouter;
