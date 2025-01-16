"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ServiceBookingSchema = new mongoose_1.Schema({
    providerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "providers", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "users", required: true },
    date: { type: mongoose_1.Schema.Types.ObjectId, ref: "BookingDate", required: true },
    amountPaid: { type: Number },
    vechileType: { type: String, required: true },
    additionalCharge: { type: Number },
    serviceType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ServiceType",
        required: true,
    },
    selectedService: [
        {
            typeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "ServiceType" },
            serviceName: { type: String, required: true },
            price: { type: Number, required: true },
        },
    ],
    suggestions: { type: String },
    status: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "inprogress",
            "completed",
            "cancelled",
            "onhold",
            "failed",
        ],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
    vechileDetails: {
        vechileId: { type: String },
        brand: { type: mongoose_1.Schema.Types.ObjectId, ref: "brand" },
        model: { type: String },
        fueltype: { type: String },
        kilometer: { type: Number },
    },
    advanceAmount: { type: Number, required: true },
    advance: { type: Boolean, default: true },
    paymentIntentId: { type: String, required: true },
    review: { type: mongoose_1.Schema.Types.ObjectId, ref: "Reviews", default: null },
});
const ServiceBookingModel = (0, mongoose_1.model)("serviceBookings", ServiceBookingSchema);
exports.default = ServiceBookingModel;
