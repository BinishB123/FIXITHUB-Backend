"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
class UserServiceInteractor {
    constructor(userRepo, stripe) {
        this.userRepo = userRepo;
        this.stripe = stripe;
    }
    async getServices(category) {
        try {
            const response = await this.userRepo.getServices(category);
            return response;
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async getAllBrand() {
        try {
            const response = await this.userRepo.getAllBrand();
            return response;
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async getAllShops(data) {
        try {
            const response = await this.userRepo.getAllShops(data);
            return response;
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async getshopProfileWithSelectedServices(data) {
        try {
            const response = await this.userRepo.getshopProfileWithSelectedServices(data);
            if (response.shopDetail) {
                const subtypes = [];
                for (let services of response.shopDetail) {
                    let finded = null;
                    if (data.vehicleType === "twoWheeler") {
                        finded = response.service.subTypes.find((service) => {
                            if (service._id + "" ===
                                services?.twoWheeler?.subtype?.type + "") {
                                return service;
                            }
                        });
                    }
                    else {
                        finded = response.service.subTypes.find((service) => {
                            if (service._id + "" ===
                                services?.fourWheeler?.subtype?.type + "") {
                                return service;
                            }
                        });
                    }
                    if (finded) {
                        const subtypeData = {
                            typeid: finded._id.toString(),
                            typename: finded.type,
                            startingprice: data.vehicleType === "twoWheeler"
                                ? services.twoWheeler?.subtype.startingPrice
                                : services.fourWheeler?.subtype.startingPrice,
                            isAdded: false,
                        };
                        subtypes.push(subtypeData);
                    }
                }
                const providerData = {
                    workshopName: response.shopDetail[0].provider.workshopName,
                    ownerName: response.shopDetail[0].provider.ownerName,
                    email: response.shopDetail[0].provider.email,
                    mobile: response.shopDetail[0].provider.mobile,
                    workshopDetails: response.shopDetail[0].provider.workshopDetails,
                    logoUrl: response.shopDetail[0].provider.logoUrl,
                    about: response.shopDetail[0].provider.about,
                    selectedService: {
                        _id: data.serviceId,
                        type: response.service.serviceType,
                    },
                    services: subtypes,
                };
                return {
                    success: true,
                    message: "hggsdvfvsdvh",
                    shopDetail: providerData,
                };
            }
            return { success: false, message: "Shop details not found" };
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async getBookingDates(id) {
        try {
            const response = await this.userRepo.getBookingDates(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async SuccessBooking(data, sessionId) {
        try {
            const response = await this.userRepo.SuccessBooking(data, sessionId);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getLatestBooking(userId) {
        try {
            const response = await this.userRepo.getLatestBooking(userId);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getServiceHistory(userID, startindex, endindex) {
        try {
            const response = await this.userRepo.getServiceHistory(userID, startindex, endindex);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async afterFullpaymentDone(docId) {
        try {
            const response = await this.userRepo.afterFullpaymentDone(docId);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async cancelBooking(id, amount, date) {
        try {
            const response = await this.userRepo.cancelBooking(id, date);
            if (response.payemntid) {
                const res = await this.stripe.refund(response.payemntid, amount);
            }
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async addReview(data, result) {
        try {
            const response = await this.userRepo.addReview(data, result);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getReviewDetails(id) {
        try {
            const response = await this.userRepo.getReviewDetails(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async deleteOneImage(id, url) {
        try {
            const response = await this.userRepo.deleteOneImage(id, url);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async editReview(id, newReview) {
        try {
            const response = await this.userRepo.editReview(id, newReview);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async addOneImage(id, newImageUrl) {
        try {
            const response = await this.userRepo.addOneImage(id, newImageUrl);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getFeedBacks(Id, limit) {
        try {
            const response = await this.userRepo.getFeedBacks(Id, limit);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = UserServiceInteractor;
