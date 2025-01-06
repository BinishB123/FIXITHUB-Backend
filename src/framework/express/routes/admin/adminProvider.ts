import express from 'express'
import AdminRepository from "../../../../interface_adapters/repositories/AdminRepo";
import AdminProviderInteractor from "../../../../usecases/admin/adminProvider";
import AdminProvideController from "../../../../interface_adapters/controllers/admin/adminProvider";
import Mailer from '../../../../framework/services/mailer';
const adminProviderRoute = express.Router()
const repository = new AdminRepository()
const interactor = new AdminProviderInteractor(repository)
const mailer = new Mailer()
const controller = new AdminProvideController(interactor,mailer)

adminProviderRoute.get('/getpendingproviders', controller.getPendingProviders.bind(controller))
adminProviderRoute.get('/getproviders', controller.getProviders.bind(controller))
adminProviderRoute.patch('/acceptorreject', controller.adminAcceptOrReject.bind(controller))
adminProviderRoute.patch('/blockorunblock',controller.providerBlockOrUnblock.bind(controller))
adminProviderRoute.get('/monthly-revenue',controller.getMonthlyRevenue.bind(controller))
adminProviderRoute.get('/top-booked-Service',controller.getTopBookedService.bind(controller))


export default adminProviderRoute