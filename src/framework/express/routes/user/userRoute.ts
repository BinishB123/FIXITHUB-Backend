import express from 'express';
import userAuthRouter from './auth';
import userServiceRoute from './userServiceRoute';
import userprofileRouter from './userProfileRoute';
import verification from '../../../../framework/express/middleware/jwtAuthenticate';
const userRoute = express.Router();

userRoute.use('/auth', userAuthRouter);
userRoute.use('/service',verification("user"),userServiceRoute)
userRoute.use('/profile',verification("user"),userprofileRouter)


export default userRoute;
