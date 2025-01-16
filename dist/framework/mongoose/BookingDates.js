"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BookingsDatesSchema = new mongoose_1.Schema({
    providerid: { type: mongoose_1.Schema.Types.ObjectId, ref: "providers", required: true },
    date: { type: Date, required: true },
    count: { type: Number, default: 0 },
});
const BookingDateModel = (0, mongoose_1.model)("BookingDate", BookingsDatesSchema);
exports.default = BookingDateModel;
