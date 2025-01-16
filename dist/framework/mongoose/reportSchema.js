"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "users", required: true },
    providerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "providers", required: true },
    BookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "serviceBookings",
        required: true,
    },
    report: { type: String, required: true },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Approved", "Rejected", "Completed"],
        default: "Pending",
    },
});
const reportModel = (0, mongoose_1.model)("reports", reportSchema);
exports.default = reportModel;
