"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
const errorInstance_1 = __importDefault(require("../../../framework/services/errorInstance"));
class UserProfileController {
    constructor(userInteractor, cloudinary, chatInteractor) {
        this.userInteractor = userInteractor;
        this.cloudinary = cloudinary;
        this.chatInteractor = chatInteractor;
    }
    async updateData(req, res, next) {
        try {
            const id = req.params.id + "";
            const { newData, whichIstoChange } = req.body;
            if (!id || !newData || !whichIstoChange) {
                return res
                    .status(statusCode_1.default.Unprocessable_Entity)
                    .json({ message: "Something went Wrong Try agin" });
            }
            const data = {
                id: id,
                newData: whichIstoChange === "name" ? newData : parseInt(newData),
                whichToChange: whichIstoChange,
            };
            const response = await this.userInteractor.userUpdateData(data);
            res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async addOrChangePhoto(req, res, next) {
        try {
            const { id, url } = req.body;
            const image = req.file?.buffer;
            if (!id || !image || id.trim() === "") {
                throw new errorInstance_1.default("Cannot Update", statusCode_1.default.Unprocessable_Entity);
            }
            if (url) {
                const deleteRes = await this.cloudinary.deleteFromCloudinary(url, "FixitHub");
                if (!deleteRes.success) {
                    throw new errorInstance_1.default("Updation Failed", statusCode_1.default.BAD_REQUEST);
                }
            }
            if (image instanceof Buffer) {
                const cloudinaryresponse = await this.cloudinary.uploadToCloudinary(image, "FixitHub", "FixithubImages");
                if (cloudinaryresponse.success) {
                    const data = {
                        id: id,
                        url: cloudinaryresponse.url ? cloudinaryresponse.url : "",
                    };
                    const response = await this.userInteractor.addOrChangePhoto(data);
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
    async getChatOfOneToOne(req, res, next) {
        try {
            const { chatId, whoWantsData } = req.params;
            const response = await this.chatInteractor.getChatOfOneToOne(chatId, whoWantsData);
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
    async getChatId(req, res, next) {
        try {
            const { providerId, userId } = req.params;
            console.log("providerId, userId in controller", providerId, userId);
            const response = await this.chatInteractor.getChatid(providerId, userId);
            return res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async notificationCountUpdater(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.userInteractor.notificationCountUpdater(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async notificationGetter(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.userInteractor.notificationsGetter(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async createReport(req, res, next) {
        try {
            const { userId, providerId, BookingId, report } = req.body.data;
            const response = await this.userInteractor.createReport({
                userId,
                providerId,
                BookingId,
                report,
            });
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getReports(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.userInteractor.getReport(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = UserProfileController;
