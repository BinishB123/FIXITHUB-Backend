"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
class ServiceBookingInteractor {
    constructor(providerRepo, stripe) {
        this.providerRepo = providerRepo;
        this.stripe = stripe;
    }
    async getBookingsAccordingToDates(id, date) {
        try {
            const response = await this.providerRepo.getBookingsAccordingToDates(id, date);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getBookingStillTodaysDate(id, startIndex, status) {
        try {
            const response = await this.providerRepo.getBookingStillTodaysDate(id, startIndex, status);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async updateStatus(id, status, amount) {
        try {
            const response = await this.providerRepo.updateStatus(id, status, amount);
            if (status === "outfordelivery" && amount < 1000 && response.paymentId) {
                const res = await this.stripe.refund(response.paymentId, amount);
                return res;
            }
            return { success: response.success };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getBookingGreaterThanTodaysDate(id) {
        try {
            const response = await this.providerRepo.getBookingGreaterThanTodaysDate(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getFeedBacks(providerId) {
        try {
            const response = await this.providerRepo.getFeedBacks(providerId);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async likeFeedBack(id, state) {
        try {
            const response = await this.providerRepo.likeFeedBack(id, state);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async reply(id, reply) {
        try {
            const response = await this.providerRepo.reply(id, reply);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = ServiceBookingInteractor;
