import express from 'express';
import { tourBookingSuccess } from '../webhooks/tourWebhooks.js';

const router = express.Router();

router.use(express.raw({ type: 'application/json' }));
router.route('/tour-booking').post(tourBookingSuccess);

export default router;
