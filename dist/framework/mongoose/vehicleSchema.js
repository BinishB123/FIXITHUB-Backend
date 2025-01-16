"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const vehicleSchema = new mongoose_1.Schema({
    vehicleType: { type: Number, required: true },
});
const vehicleModel = (0, mongoose_1.model)("vehicletype", vehicleSchema);
exports.default = vehicleModel;
