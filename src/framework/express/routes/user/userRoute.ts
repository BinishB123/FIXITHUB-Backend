import express from 'express';
import userAuthRouter from './auth';
import userServiceRoute from './userServiceRoute';

const userRoute = express.Router();

// Set up the nested /auth route
userRoute.use('/auth', userAuthRouter);
userRoute.use('/service',userServiceRoute)


export default userRoute;
