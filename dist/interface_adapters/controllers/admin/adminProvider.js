"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
class AdminProvideController {
    constructor(adminProviderInteractor, mailer) {
        this.adminProviderInteractor = adminProviderInteractor;
        this.mailer = mailer;
    }
    async getPendingProviders(req, res) {
        try {
            const response = await this.adminProviderInteractor.getPendingProviders();
            if (!response.success) {
                return res.status(500).json({ success: response.success });
            }
            return res.status(200).json({ success: response.success, providers: response.providers });
        }
        catch (error) {
            return res.status(500).json({ success: false });
        }
    }
    async getProviders(req, res) {
        try {
            const response = await this.adminProviderInteractor.getProviders();
            if (!response.success) {
                return res.status(500).json({ success: response.success });
            }
            return res.status(200).json({ success: response.success, providers: response.providers });
        }
        catch (error) {
            return res.status(500).json({ success: false });
        }
    }
    async adminAcceptOrReject(req, res) {
        const { id, state, reason, email, accept } = req.body;
        if (accept === false) {
            if (!id || !reason || !email) {
                return res.status(statusCode_1.default.Unprocessable_Entity).json({ message: "failed to Reject" });
            }
        }
        const response = await this.adminProviderInteractor.adminAcceptAndReject(id, state);
        if (response.success) {
            if (accept === false) {
                const data = {
                    email: email, subject: "Rejected From FixitHub", text: reason
                };
                const response = await this.mailer.sendMailToUsers(data.email, data.subject, data.text);
                if (!response.success) {
                    return res.status(statusCode_1.default.BAD_REQUEST).json({ message: "Email Sending Failed" });
                }
            }
            return res.status(200).json({ success: true, message: "updated" });
        }
        return res.status(400).json({ succes: false });
    }
    async providerBlockOrUnblock(req, res) {
        const { id, state } = req.body;
        const response = await this.adminProviderInteractor.providerBlockOrUnblock(id, state);
        if (response.success) {
            return res.status(200).json({ success: true, message: "updated" });
        }
        return res.status(400).json({ succes: false });
    }
    async getMonthlyRevenue(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.adminProviderInteractor.getMonthlyRevenue(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getTopBookedService(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.adminProviderInteractor.TopServicesBooked(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = AdminProvideController;
