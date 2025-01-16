"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const brandSchema = new mongoose_1.Schema({
    brand: { type: String, required: true },
});
const brandModel = (0, mongoose_1.model)("brand", brandSchema);
exports.default = brandModel;
