import expresss from 'express'
import AdminAuthRouter from './auth'
import adminUserRouter from './adminuser'
import adminProviderRoute from './adminProvider'

const adminRoute = expresss.Router()
adminRoute.use('/auth',AdminAuthRouter)
adminRoute.use('/user',adminUserRouter)
adminRoute.use('/providers',adminProviderRoute)



export default adminRoute