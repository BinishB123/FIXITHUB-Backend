"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
const errorInstance_1 = __importDefault(require("../../../framework/services/errorInstance"));
class ProviderProfileController {
    constructor(providerProfileInteractor, cloudinary, chatInteractor) {
        this.providerProfileInteractor = providerProfileInteractor;
        this.cloudinary = cloudinary;
        this.chatInteractor = chatInteractor;
    }
    async getDataToProfile(req, res) {
        try {
            const id = req.query.id + "";
            if (!id)
                return res
                    .status(statusCode_1.default.FORBIDDEN)
                    .json({ message: "provided id not passed" });
            const response = await this.providerProfileInteractor.getDataToProfile(id);
            if (!response.success) {
                if (response.message === "500") {
                    return res
                        .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                        .json({ message: "Internal Server Error" });
                }
                return res
                    .status(statusCode_1.default.Unprocessable_Entity)
                    .json({ message: "something went wrong" });
            }
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal Server Error" });
        }
    }
    async editAbout(req, res) {
        try {
            const { id, about } = req.body.data;
            const response = await this.providerProfileInteractor.editabout({
                id,
                about,
            });
            if (!response.success) {
                return response.message === "500"
                    ? res.status(statusCode_1.default.INTERNAL_SERVER_ERROR).json(response)
                    : res.status(statusCode_1.default.Unprocessable_Entity).json(response);
            }
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "internal server error " });
        }
    }
    async addLogo(req, res) {
        try {
            console.log(req.body);
            const { id } = req.body;
            const image = req.file?.buffer;
            if (image instanceof Buffer) {
                const cloudinaryresponse = await this.cloudinary.uploadToCloudinary(image, "FixitHub", "FixithubImages");
                if (cloudinaryresponse.success) {
                    const data = {
                        id: id,
                        url: cloudinaryresponse.url ? cloudinaryresponse.url : "",
                    };
                    const response = await this.providerProfileInteractor.addImage(data);
                    if (response.success) {
                        return res.status(statusCode_1.default.OK).json({ url: response.url });
                    }
                }
            }
            return res
                .status(statusCode_1.default.FORBIDDEN)
                .json({ message: "somethingw went wrong" });
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "internal server error" });
        }
    }
    async updateProfile(req, res) {
        try {
            const { id, whichisTotChange, newOne } = req.body;
            const data = { id, whichisTotChange, newOne };
            const response = await this.providerProfileInteractor.updateProfiledatas(data);
            if (!response.success) {
                if (response.message === "500") {
                    return res
                        .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                        .json("internal server error");
                }
                else {
                    return res
                        .status(statusCode_1.default.Unprocessable_Entity)
                        .json("something went wrong");
                }
            }
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "internal server" });
        }
    }
    async getAllBrands(req, res) {
        try {
            const id = req.query.id + "";
            const response = await this.providerProfileInteractor.getAllBrand(id);
            if (!response.success) {
                if (response.message === "500") {
                    return res
                        .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                        .json({ message: "failed internal server error" });
                }
                return res
                    .status(statusCode_1.default.Unprocessable_Entity)
                    .json({ message: "failed to Fetch Data" });
            }
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "failed internal server error" });
        }
    }
    async changePassword(req, res, next) {
        try {
            const { id, currentpassowrd, newpassowrd } = req.body;
            if (!id || !currentpassowrd || !newpassowrd) {
                return res
                    .status(statusCode_1.default.Unprocessable_Entity)
                    .json({ message: "Data missing something went wrong" });
            }
            const response = await this.providerProfileInteractor.changepassword({
                id,
                currentpassowrd,
                newpassowrd,
            });
            return res.status(statusCode_1.default.OK).json({ message: "password changed" });
        }
        catch (error) {
            next(error);
        }
    }
    async updateLogo(req, res, next) {
        try {
            const { id, url } = req.body;
            const image = req.file?.buffer;
            if (!id || !url || !image) {
                throw new errorInstance_1.default("Data are Not Provided", statusCode_1.default.Unprocessable_Entity);
            }
            const deleted = await this.cloudinary.deleteFromCloudinary(url, "FixitHub");
            if (!deleted) {
                throw new errorInstance_1.default("Something Went Wrong", statusCode_1.default.Unprocessable_Entity);
            }
            if (image instanceof Buffer) {
                const cloudinaryresponse = await this.cloudinary.uploadToCloudinary(image, "FixitHub", "FixithubImages");
                if (cloudinaryresponse.success) {
                    const data = {
                        id: id,
                        url: cloudinaryresponse.url ? cloudinaryresponse.url : "",
                    };
                    const response = await this.providerProfileInteractor.updateLogo(data.url, data.id);
                    if (response.success) {
                        return res.status(statusCode_1.default.OK).json({ url: response.url });
                    }
                }
            }
        }
        catch (error) {
            next(error);
        }
    }
    async getChatId(req, res, next) {
        console.log("vannu");
        try {
            const { providerId, userId } = req.params;
            console.log(providerId, userId);
            const response = await this.chatInteractor.getChatid(providerId, userId);
            console.log("ress", response);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            console.log("56789", error.message);
            next(error);
        }
    }
    async getOneToneChat(req, res, next) {
        try {
            const { chatid, whoWantsData } = req.params;
            const response = await this.chatInteractor.getChatOfOneToOne(chatid, whoWantsData);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async fetchChat(req, res, next) {
        try {
            const { whom, id } = req.params;
            const response = await this.chatInteractor.fetchChats(whom, id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async addMessage(req, res, next) {
        try {
            const { sender, chatId, message } = req.body;
            console.log(chatId);
            const response = await this.chatInteractor.addNewMessage(sender, chatId, message);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async notificationCountUpdater(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.providerProfileInteractor.notificationCountUpdater(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async notificationGetter(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.providerProfileInteractor.notificationsGetter(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getMonthlyRevenue(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.providerProfileInteractor.getMonthlyRevenue(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getTopBookedService(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.providerProfileInteractor.TopServicesBooked(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getSalesReport(req, res, next) {
        try {
            const { id, year, month } = req.params;
            const response = await this.providerProfileInteractor.getSalesReport(id, parseInt(year), parseInt(month));
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = ProviderProfileController;
