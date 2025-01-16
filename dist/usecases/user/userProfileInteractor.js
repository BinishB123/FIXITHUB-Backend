"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
class UserProfileInteractor {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async userUpdateData(data) {
        try {
            const response = await this.userRepo.userUpdateData(data);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async addOrChangePhoto(data) {
        try {
            const response = await this.userRepo.addOrChangePhoto(data);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async notificationCountUpdater(id) {
        try {
            const response = await this.userRepo.notificationCountUpdater(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async notificationsGetter(id) {
        try {
            const response = await this.userRepo.notificationsGetter(id);
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
    async createReport(data) {
        try {
            const response = await this.userRepo.createReport({ ...data });
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getReport(id) {
        try {
            const response = await this.userRepo.getReport(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = UserProfileInteractor;
