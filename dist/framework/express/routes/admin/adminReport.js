"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminReportController_1 = __importDefault(require("../../../../interface_adapters/controllers/admin/adminReportController"));
const AdminRepo_1 = __importDefault(require("../../../../interface_adapters/repositories/AdminRepo"));
const adminReport_1 = __importDefault(require("../../../../usecases/admin/adminReport"));
const express_1 = __importDefault(require("express"));
const repo = new AdminRepo_1.default();
const interactor = new adminReport_1.default(repo);
const controller = new adminReportController_1.default(interactor);
const adminReportRoute = express_1.default.Router();
adminReportRoute.get('/getreport', controller.getReport.bind(controller));
adminReportRoute.patch('/ediReport/:id/:status', controller.editReport.bind(controller));
adminReportRoute.get('/reportdetails/:id', controller.getReportDeatils.bind(controller));
adminReportRoute.get('/get-salesReport/:year/:month', controller.getSalesReport.bind(controller));
exports.default = adminReportRoute;
