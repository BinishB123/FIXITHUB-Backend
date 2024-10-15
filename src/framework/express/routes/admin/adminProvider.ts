import express from 'express'
import AdminRepository from "../../../../interface_adapters/repositories/AdminRepo";
import AdminProviderInteractor from "../../../../usecases/admin/adminProvider";
import AdminProvideController from "../../../../interface_adapters/controllers/admin/adminProvider";
const adminProviderRoute = express.Router()
const repository = new AdminRepository()
const interactor = new AdminProviderInteractor(repository)
const controller = new AdminProvideController(interactor)

adminProviderRoute.get('/getpendingproviders', controller.getPendingProviders.bind(controller))
adminProviderRoute.get('/getproviders', controller.getProviders.bind(controller))
adminProviderRoute.patch('/acceptorreject', controller.adminAcceptOrReject.bind(controller))
adminProviderRoute.patch('/blockorunblock',controller.providerBlockOrUnblock.bind(controller))


export default adminProviderRoute