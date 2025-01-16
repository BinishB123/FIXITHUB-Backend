"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
class ProviderServiceBookingController {
    constructor(serviceBookingInteractor) {
        this.serviceBookingInteractor = serviceBookingInteractor;
    }
    async getProviderDataAccordingToDate(req, res, next) {
        try {
            const { id, date } = req.params;
            console.log("id", id, date);
            const response = await this.serviceBookingInteractor.getBookingsAccordingToDates(id, new Date(date));
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getBookingStillTodaysDate(req, res, next) {
        try {
            const { id, startIndex } = req.params;
            let { status } = req.query;
            status = typeof status === "string" ? status : undefined;
            const response = await this.serviceBookingInteractor.getBookingStillTodaysDate(id, parseInt(startIndex), status);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async updateStatus(req, res, next) {
        try {
            const { id, status, amount } = req.params;
            if (!id || !status || !amount) {
                return res
                    .status(statusCode_1.default.FORBIDDEN)
                    .json({ message: "Something went Wrong" });
            }
            const response = await this.serviceBookingInteractor.updateStatus(id, status, parseInt(amount));
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getBookingGreaterThanTodaysDate(req, res, next) {
        try {
            const { userid } = req.params;
            const response = await this.serviceBookingInteractor.getBookingGreaterThanTodaysDate(userid);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getFeedBacks(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.serviceBookingInteractor.getFeedBacks(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async like(req, res, next) {
        try {
            const { id, status } = req.body;
            const response = await this.serviceBookingInteractor.likeFeedBack(id, status);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async reply(req, res, next) {
        try {
            const { id, reply } = req.body;
            const response = await this.serviceBookingInteractor.reply(id, reply);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = ProviderServiceBookingController;
