"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorInstance_1 = __importDefault(require("../../../framework/services/errorInstance"));
const errorHandler = (error, req, res, next) => {
    if (error instanceof errorInstance_1.default) {
        res.status(error.statusCode).json({ error: error.message });
    }
    else {
        res.status(500).json({ error: error.message });
    }
};
exports.default = errorHandler;
