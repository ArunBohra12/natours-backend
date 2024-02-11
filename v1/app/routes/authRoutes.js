import express from 'express';
import {
  signInWithGoogle,
  googleAuthVerifyHandler,
  loginWithPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.get('/google', signInWithGoogle);
router.get('/google/verify-auth', googleAuthVerifyHandler);
router.post('/password/login', loginWithPassword);

export default router;
