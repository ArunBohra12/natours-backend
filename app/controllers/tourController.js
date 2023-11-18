import AppError from '../error/appError.js';
import StripeHelper from '../helpers/stripeHelper.js';
import Booking from '../models/bookingModel.js';
import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import { filterObject } from '../utils/filters.js';

export const createTour = catchAsync(async (req, res, next) => {
  const filterBodyParams = [
    'name',
    'duration',
    'maxGroupSize',
    'difficulty',
    'price',
    'summary',
    'description',
    'startDates',
    'startLocation',
    'locations',
  ];

  const tour = await Tour.create(filterObject(req.body, filterBodyParams));

  res.status(201).json({
    status: true,
    message: 'Tour created successfully',
    data: tour,
  });
});

export const getAllTours = catchAsync(async (req, res, next) => {
  const allTours = await Tour.find(req.tourFilter || {});

  res.status(200).json({
    status: true,
    message: 'Success',
    data: allTours,
  });
});

export const getSingleTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const tour = await Tour.find({ slug });

  res.status(200).json({
    status: true,
    message: 'Success',
    data: tour,
  });
});

export const createTourBookingCheckoutSession = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const tour = await Tour.findById(tourId);

  const stripe = new StripeHelper();
  const [status, checkoutSession] = await stripe.createCheckoutSession(tour, req.user);

  if (status === false) {
    return next(new AppError(checkoutSession.message), 500);
  }

  res.status(200).json({
    status: true,
    message: 'Checkout session created successfully',
    data: {
      checkout: checkoutSession.url,
    },
  });
});

// export const bookTour = catchAsync(async (tourId, userId) => {
//   await Booking.create({
//     tour: tourId,
//     user: userId,
//   });

//   return [true, {}];
// });
