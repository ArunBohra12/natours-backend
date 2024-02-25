import { Router } from 'express';
import userSignupController from './signup/userSignupController';
import userLoginWithEmailController from './login/userLoginController';

const userRouter = Router();

userRouter.post('/signup-with-email', userSignupController);
userRouter.post('/login-with-email', userLoginWithEmailController);

export default userRouter;
