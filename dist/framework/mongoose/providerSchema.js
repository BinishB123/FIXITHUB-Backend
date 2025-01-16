"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const providerSchema = new mongoose_1.Schema({
    workshopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    workshopDetails: {
        address: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    blocked: { type: Boolean, required: true, default: false },
    requestAccept: { type: Boolean, required: true, default: false },
    supportedBrands: [
        {
            brand: { type: mongoose_1.Schema.Types.ObjectId, ref: "brand" },
        },
    ],
    logoUrl: { type: String },
    about: { type: String },
});
providerSchema.index({ "workshopDetails.location": "2dsphere" });
const providerModel = (0, mongoose_1.model)("providers", providerSchema);
exports.default = providerModel;
