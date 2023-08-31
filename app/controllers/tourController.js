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
    status: 1,
    message: 'Tour created successfully',
    data: tour,
  });
});

export const getAllTours = catchAsync(async (req, res, next) => {
  const allTours = await Tour.find(req.tourFilter || {});

  res.status(200).json({
    status: 1,
    message: 'Success',
    data: allTours,
  });
});

export const getSingleTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const tour = await Tour.find({ slug });

  res.status(200).json({
    status: 1,
    message: 'Success',
    data: tour,
  });
});
