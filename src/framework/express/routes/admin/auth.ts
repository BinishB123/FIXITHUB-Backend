import AdminRepository from "../../../../interface_adapters/repositories/AdminRepo"
import express from 'express'
import AdminAuthInteractor from "../../../../usecases/admin/adminAuth"
import AdminAuthController from "../../../../interface_adapters/controllers/admin/adminAuth"
import JwtServices from "../../../../framework/services/jwt"
import verification from "../../../express/middleware/jwtAuthenticate";

const AdminAuthRouter = express.Router()
const repository = new AdminRepository()
const jwtServices = new JwtServices(process.env.ACCESSTOKENKEY+"", process.env.REFRESHTOKENKEY+"")
const interactor = new AdminAuthInteractor(repository,jwtServices)
const controller = new AdminAuthController(interactor)

AdminAuthRouter.post('/signin',controller.signIn.bind(controller))
AdminAuthRouter.get('/logout',controller.logout.bind(controller))
AdminAuthRouter.get('/checker',verification("admin") ,controller.checker.bind(controller))





export default AdminAuthRouter