"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
class ProviderBookingDateInteractor {
    constructor(providerRepo) {
        this.providerRepo = providerRepo;
    }
    async addDate(date, id) {
        try {
            const response = await this.providerRepo.addDate(date, id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async providerAddedDates(id) {
        try {
            const response = this.providerRepo.providerAddedDates(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async updateCount(id, toDo) {
        try {
            const response = await this.providerRepo.updateCount(id, toDo);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = ProviderBookingDateInteractor;
