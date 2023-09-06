import express from 'express';
import { signInWithGoogle, googleAuthVerifyHandler } from '../controllers/authController.js';

const router = express.Router();

router.get('/google', signInWithGoogle);
router.get('/google/verify-auth', googleAuthVerifyHandler);

export default router;
