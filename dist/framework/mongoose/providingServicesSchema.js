"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const providingServicesSchema = new mongoose_1.Schema({
    workshopId: { type: mongoose_1.Schema.Types.ObjectId, ref: "providers", required: true },
    twoWheeler: [
        {
            typeId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "ServiceType",
                required: true,
            },
            category: { type: String, required: true },
            subtype: [
                {
                    type: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: "ServiceType",
                        required: true,
                    },
                    startingPrice: { type: Number, required: true },
                },
            ],
        },
    ],
    fourWheeler: [
        {
            typeId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "ServiceType",
                required: true,
            },
            category: { type: String, required: true },
            subtype: [
                {
                    type: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: "ServiceType",
                        required: true,
                    },
                    startingPrice: { type: Number, required: true },
                },
            ],
        },
    ],
});
const providingServicesModel = (0, mongoose_1.model)("ProvidingServices", providingServicesSchema);
exports.default = providingServicesModel;
