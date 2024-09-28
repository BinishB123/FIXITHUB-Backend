import providerAuthRouter from "../provider/auth";
import express from 'express'

const providerRouter = express.Router()

providerRouter.use('/auth',providerAuthRouter)



export default providerRouter