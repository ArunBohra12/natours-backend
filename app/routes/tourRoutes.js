import express from 'express';
import { createTour, getAllTours } from '../controllers/tourController.js';

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);

export default router;
