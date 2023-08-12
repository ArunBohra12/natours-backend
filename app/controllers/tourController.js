import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';

export const createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);

  res.status(200).json({
    status: 1,
    message: 'Tour created successfully',
    data: tour,
  });
});

export const getAllTours = catchAsync(async (req, res, next) => {
  const allTours = await Tour.find();

  res.status(200).json({
    status: 1,
    message: 'Success',
    data: allTours,
  });
});
