"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, statusCode = 500, reasons = []) {
        super(message);
        this.statusCode = statusCode;
        this.reasons = reasons;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.default = CustomError;
