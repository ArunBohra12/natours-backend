import express from 'express';
import { signInWithGoogle, googleOAuthRedirectHandler } from '../controllers/authController.js';

const router = express.Router();

router.get('/google', signInWithGoogle);
router.get('/google/redirect', googleOAuthRedirectHandler);

export default router;
