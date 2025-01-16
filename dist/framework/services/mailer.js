"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateOtp_1 = __importDefault(require("./generateOtp"));
const sendMail_1 = __importDefault(require("./sendMail"));
class Mailer {
    async sendMail(email) {
        const otp = (0, generateOtp_1.default)();
        const response = await (0, sendMail_1.default)(email, otp);
        return { otp: otp, success: response.success };
    }
    async sendMailToUsers(email, subject, text) {
        const response = await (0, sendMail_1.default)(email, undefined, subject, text);
        return response;
    }
}
exports.default = Mailer;
