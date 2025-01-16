"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
class AdminReportInteractor {
    constructor(adminRepo) {
        this.adminRepo = adminRepo;
    }
    async getReport() {
        try {
            const response = await this.adminRepo.getReport();
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async editReport(id, status) {
        try {
            const response = await this.adminRepo.editReport(id, status);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getReportDeatils(id) {
        try {
            const response = await this.adminRepo.getReportDeatils(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getSalesReport(year, month) {
        try {
            const response = await this.adminRepo.getSalesReport(year, month);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = AdminReportInteractor;
