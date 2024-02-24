import { Router } from 'express';
import userRouter from '../features/user/userRoutes';

const apiV1Routes = Router();

apiV1Routes.use('/user', userRouter);

export default apiV1Routes;
