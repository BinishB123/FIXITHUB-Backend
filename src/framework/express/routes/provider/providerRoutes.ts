import providerAuthRouter from "../provider/auth";
import providerAddServiceRoute from "./providerAddService";
import verification from '../../../../framework/express/middleware/jwtAuthenticate'
import providerProfileRoute from "./providerPofile";
import express from 'express'
import providerDateRoute from "./providerDateRoute";
import providerServiceBookingRoute from "./providerServiceBookingRoute";


const providerRouter = express.Router()

providerRouter.use('/auth',providerAuthRouter)
providerRouter.use('/addservice',verification("provider"),providerAddServiceRoute)
providerRouter.use('/profile',verification("provider"),providerProfileRoute)
providerRouter.use('/bookings',verification("provider"),providerDateRoute)
providerRouter.use('/servicebooking',verification("provider"),providerServiceBookingRoute)



export default providerRouter