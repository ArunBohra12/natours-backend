import express from 'express';
import filterTours from '../middlewares/filterTours.js';
import { requiresLogin } from '../middlewares/userAuth.js';
import { requiresAdminLogin } from '../middlewares/adminAuth.js';
import {
  createTour,
  getAllTours,
  getSingleTour,
  createTourBookingCheckoutSession,
} from '../controllers/tourController.js';

const router = express.Router();

router.route('/').get(filterTours, getAllTours).post(requiresAdminLogin, createTour);
router.route('/:slug').get(getSingleTour);
router.route('/book-tour/:tourId').post(requiresLogin, createTourBookingCheckoutSession);

export default router;
