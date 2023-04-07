const express = require('express');
const tourRouter = require('./v1Routes/tourRoutes');
const userRouter = require('./v1Routes/userRoutes');
const reviewRouter = require('./v1Routes/reviewRoutes');
const bookingRouter = require('./v1Routes/bookingRoutes');

const router = express.Router();

router.use('/tours', tourRouter);
router.use('/users', userRouter);
router.use('/reviews', reviewRouter);
router.use('/bookings', bookingRouter);

module.exports = router;
