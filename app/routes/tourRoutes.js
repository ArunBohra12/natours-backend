import express from 'express';
import { createTour, getAllTours, getSingleTour } from '../controllers/tourController.js';
import filterTours from '../middlewares/filterTours.js';

const router = express.Router();

router.route('/').get(filterTours, getAllTours).post(createTour);
router.route('/:slug').get(getSingleTour);

export default router;
