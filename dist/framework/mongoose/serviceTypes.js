"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subtypeSchema = new mongoose_1.Schema({
    type: { type: String },
}, { _id: true });
const serviceTypeSchema = new mongoose_1.Schema({
    category: { type: String, required: true },
    serviceType: { type: String, required: true },
    imageUrl: { type: String, required: true },
    subTypes: [subtypeSchema],
});
const ServiceTypeModel = (0, mongoose_1.model)("ServiceType", serviceTypeSchema);
exports.default = ServiceTypeModel;
