import express from 'express';
import userAuthRouter from './auth';

const userRoute = express.Router();

// Set up the nested /auth route
userRoute.use('/auth', userAuthRouter);


export default userRoute;
