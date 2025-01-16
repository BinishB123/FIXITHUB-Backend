"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
class AdminReportController {
    constructor(reportInteractor) {
        this.reportInteractor = reportInteractor;
    }
    async getReport(req, res, next) {
        try {
            const response = await this.reportInteractor.getReport();
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async editReport(req, res, next) {
        try {
            const { id, status } = req.params;
            const response = await this.reportInteractor.editReport(id, status);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getReportDeatils(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.reportInteractor.getReportDeatils(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getSalesReport(req, res, next) {
        try {
            const { year, month } = req.params;
            const response = await this.reportInteractor.getSalesReport(parseInt(year), parseInt(month));
            res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = AdminReportController;
