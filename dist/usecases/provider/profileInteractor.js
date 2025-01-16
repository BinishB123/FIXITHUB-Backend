"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
class ProviderProfileInteractor {
    constructor(providerRepo) {
        this.providerRepo = providerRepo;
    }
    async getDataToProfile(id) {
        try {
            const response = await this.providerRepo.getDataToProfile(id);
            return response;
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async editabout(data) {
        try {
            const response = await this.providerRepo.editabout(data);
            return response;
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async addImage(data) {
        try {
            const response = await this.providerRepo.addImage(data);
            return response;
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async updateProfiledatas(data) {
        try {
            const response = await this.providerRepo.updateProfiledatas(data);
            return response;
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async getAllBrand(id) {
        try {
            const response = await this.providerRepo.getAllBrand(id);
            return response;
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async changepassword(data) {
        try {
            const response = await this.providerRepo.changepassword(data);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async updateLogo(url, id) {
        try {
            const response = await this.providerRepo.updateLogo(url, id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async notificationCountUpdater(id) {
        try {
            const response = await this.providerRepo.notificationCountUpdater(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async notificationsGetter(id) {
        try {
            const response = await this.providerRepo.notificationsGetter(id);
            console.log("his.providerRepo.notificationsGetter(id)", response);
            if (response.countOfUnreadMessages.length > 0 &&
                response.notfiyData.length > 0) {
                const data = response.notfiyData.map((data) => {
                    const matchedItem = response.countOfUnreadMessages.find((item) => item._id + "" === data._id + "");
                    return { ...data, count: matchedItem ? matchedItem.count : 1 };
                });
                return { notfiyData: data };
            }
            return { notfiyData: [] };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getMonthlyRevenue(id) {
        try {
            const response = await this.providerRepo.getMonthlyRevenue(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async TopServicesBooked(id) {
        try {
            const response = await this.providerRepo.TopServicesBooked(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getSalesReport(id, year, month) {
        try {
            const response = await this.providerRepo.getSalesReport(id, year, month);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = ProviderProfileInteractor;
