"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailer_1 = require("../../entities/services/mailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// send mail using nodemail to user
const sendMail = async (email, otp, subject, text) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        auth: {
            user: mailer_1.Mailer.user,
            pass: mailer_1.Mailer.password,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const info = {
        subject: subject != undefined ? subject : "Signup Verification Mail from FIXITHUB",
        text: otp
            ? `Your OTP is ${otp}. Use this OTP to complete your signup process.`
            : text,
    };
    const mailOptions = {
        from: mailer_1.Mailer.user,
        to: email,
        subject: info.subject,
        text: info.text,
    };
    try {
        const response = await transporter.sendMail(mailOptions);
        return { success: true };
    }
    catch (error) {
        console.log("error message from sending mail in sendmail :", error.message);
        return { success: false };
    }
};
exports.default = sendMail;
