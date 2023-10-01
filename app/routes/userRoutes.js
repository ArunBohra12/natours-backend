import express from 'express';
import { userSignup, updateUserProfilePhoto } from '../controllers/userController.js';
import { sendUserVerificationEmail, verifyEmail } from '../controllers/authController.js';
import { requiresLogin } from '../middlewares/userAuth.js';
import memoryUpload from '../middlewares/multer.js';

const router = express.Router();

router.post('/signup', userSignup);
router.post('/profile-photo', memoryUpload.single('photo'), updateUserProfilePhoto);
router.post('/send-verification-email', requiresLogin, sendUserVerificationEmail);
router.post('/verify-email', requiresLogin, verifyEmail);

export default router;
