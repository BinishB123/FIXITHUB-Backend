"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateRandomOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);
    return otp + "";
}
exports.default = generateRandomOTP;
