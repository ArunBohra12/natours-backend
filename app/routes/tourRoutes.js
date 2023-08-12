import express from 'express';
import { createTour, getAllTours, getSingleTour } from '../controllers/tourController.js';

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/:slug').get(getSingleTour);

export default router;
