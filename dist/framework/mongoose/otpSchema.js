"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    otp: { type: String, required: true },
    userEmail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: "1m" } },
    isUsed: { type: Boolean, default: false },
});
const otpModel = (0, mongoose_1.model)("otp", otpSchema);
exports.default = otpModel;
