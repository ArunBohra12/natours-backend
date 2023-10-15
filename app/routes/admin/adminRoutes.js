import express from 'express';
import {
  createAdmin,
  generateAdminLoginLink,
  loginAdmin,
} from '../../controllers/admin/adminController.js';

const router = express.Router();

router.route('/').post(createAdmin);
router.post('/request-login', generateAdminLoginLink);
router.post('/login/:token', loginAdmin);

export default router;
