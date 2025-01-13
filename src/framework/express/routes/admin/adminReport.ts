import AdminReportController from "../../../../interface_adapters/controllers/admin/adminReportController";
import AdminRepository from "../../../../interface_adapters/repositories/AdminRepo";
import AdminReportInteractor from "../../../../usecases/admin/adminReport";
import express from "express";



const repo = new AdminRepository()
const interactor = new AdminReportInteractor(repo)
const controller = new AdminReportController(interactor)
const adminReportRoute = express.Router()

adminReportRoute.get('/getreport',controller.getReport.bind(controller))
adminReportRoute.patch('/ediReport/:id/:status',controller.editReport.bind(controller))
adminReportRoute.get('/reportdetails/:id',controller.getReportDeatils.bind(controller))
adminReportRoute.get('/get-salesReport/:year/:month',controller.getSalesReport.bind(controller))


export default adminReportRoute