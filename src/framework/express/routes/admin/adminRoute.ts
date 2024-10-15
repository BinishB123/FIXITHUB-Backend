import expresss from 'express'
import AdminAuthRouter from './auth'
import adminUserRouter from './adminuser'
import adminProviderRoute from './adminProvider'
import adminSettingsRoute from './adminSettings'
import verification from '../../../../framework/express/middleware/jwtAuthenticate'
const adminRoute = expresss.Router()
adminRoute.use('/auth',AdminAuthRouter)
adminRoute.use('/user',verification("admin"),adminUserRouter)
adminRoute.use('/providers',verification("admin"),adminProviderRoute)
adminRoute.use('/settings',verification("admin"),adminSettingsRoute)



export default adminRoute