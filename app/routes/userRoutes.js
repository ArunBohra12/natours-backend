import express from 'express';
import { userSignup, updateUserProfilePhoto } from '../controllers/userController.js';
import memoryUpload from '../middlewares/multer.js';

const router = express.Router();

router.post('/signup', userSignup);
router.post('/profile-photo', memoryUpload.single('photo'), updateUserProfilePhoto);

export default router;
