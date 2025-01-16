"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    mobile: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    logoUrl: { type: String },
    blocked: { type: Boolean, required: true, default: false },
});
const userModel = (0, mongoose_1.model)("users", userSchema);
exports.default = userModel;
