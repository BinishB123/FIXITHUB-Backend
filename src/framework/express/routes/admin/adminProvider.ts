import express from 'express'
import AdminRepository from "../../../../interface_adapters/repositories/AdminRepo";
import AdminProviderInteractor from "../../../../usecases/admin/adminProvider";
import AdminProvideController from "../../../../interface_adapters/controllers/admin/adminProvider";
import verification from '../../../../framework/express/middleware/jwtAuthenticate';
const adminProviderRoute = express.Router()
const repository = new AdminRepository()
const interactor = new AdminProviderInteractor(repository)
const controller = new AdminProvideController(interactor)

adminProviderRoute.get('/getpendingproviders', verification("admin"), controller.getPendingProviders.bind(controller))
adminProviderRoute.get('/getproviders', verification("admin"), controller.getProviders.bind(controller))
adminProviderRoute.patch('/acceptorreject', verification("admin"), controller.adminAcceptOrReject.bind(controller))
adminProviderRoute.patch('/blockorunblock',verification('admin'),controller.providerBlockOrUnblock.bind(controller))


export default adminProviderRoute