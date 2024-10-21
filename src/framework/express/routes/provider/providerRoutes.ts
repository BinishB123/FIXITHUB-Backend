import providerAuthRouter from "../provider/auth";
import providerAddServiceRoute from "./providerAddService";
import verification from '../../../../framework/express/middleware/jwtAuthenticate'

import express from 'express'


const providerRouter = express.Router()

providerRouter.use('/auth',providerAuthRouter)
providerRouter.use('/addservice',verification("provider"),providerAddServiceRoute)



export default providerRouter