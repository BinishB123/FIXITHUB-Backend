import providerAuthRouter from "../provider/auth";
import providerAddServiceRoute from "./providerAddService";
import verification from '../../../../framework/express/middleware/jwtAuthenticate'
import providerProfileRoute from "./providerPofile";

import express from 'express'


const providerRouter = express.Router()

providerRouter.use('/auth',providerAuthRouter)
providerRouter.use('/addservice',verification("provider"),providerAddServiceRoute)
providerRouter.use('/profile',verification("provider"),providerProfileRoute)



export default providerRouter