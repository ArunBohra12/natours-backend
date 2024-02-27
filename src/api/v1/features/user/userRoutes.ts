import { Router } from 'express';

import userSignupController from './signup/userSignupController';
import userLoginWithEmailController from './login/userLoginController';
import {
  getGoogleAuthUrlHandler,
  userLoginWithGoogleController,
} from './googleSignin/userGoogleSigninController';

const userRouter = Router();

userRouter.post('/signup-with-email', userSignupController);
userRouter.post('/login-with-email', userLoginWithEmailController);
userRouter.get('/google-auth-url', getGoogleAuthUrlHandler);
userRouter.post('/login-with-google', userLoginWithGoogleController);

export default userRouter;
