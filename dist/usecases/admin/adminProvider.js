"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
class AdminProviderInteractor {
    constructor(adminrepo) {
        this.adminrepo = adminrepo;
    }
    async getPendingProviders() {
        try {
            const response = await this.adminrepo.getPendingProviders();
            if (!response.success) {
                return { success: false, message: response.message };
            }
            return { success: true, providers: response.providers };
        }
        catch (error) {
            return { success: false };
        }
    }
    async getProviders() {
        try {
            const response = await this.adminrepo.getProviders();
            if (!response.success) {
                return { success: false, message: response.message };
            }
            return { success: true, providers: response.providers };
        }
        catch (error) {
            return { success: false };
        }
    }
    async adminAcceptAndReject(id, state) {
        try {
            const response = await this.adminrepo.adminRequestAcceptAndReject(id, state);
            if (response.success) {
                return { success: true, message: "" };
            }
            return { success: false };
        }
        catch (error) {
            return { success: true };
        }
    }
    async providerBlockOrUnblock(id, state) {
        try {
            const response = await this.adminrepo.providerBlockOrUnblock(id, state);
            if (response.success) {
                return { success: true, message: "" };
            }
            return { success: false };
        }
        catch (error) {
            return { success: true };
        }
    }
    async getMonthlyRevenue(id) {
        try {
            const response = await this.adminrepo.getMonthlyRevenue(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async TopServicesBooked(id) {
        try {
            const response = await this.adminrepo.TopServicesBooked(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = AdminProviderInteractor;
