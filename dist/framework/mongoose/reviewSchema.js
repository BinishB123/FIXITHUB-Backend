"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const images = new mongoose_1.Schema({
    url: { type: String },
}, { _id: false });
const reviewSchema = new mongoose_1.Schema({
    bookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "serviceBookings",
        required: true,
    },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "users", required: true },
    ProviderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "providers", required: true },
    ServiceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ServiceType",
        required: true,
    },
    opinion: { type: String, required: true },
    reply: { type: String, default: null },
    like: { type: Boolean, default: false },
    images: [images],
});
const reviewModel = (0, mongoose_1.model)("Reviews", reviewSchema);
exports.default = reviewModel;
