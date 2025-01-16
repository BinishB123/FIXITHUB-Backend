"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRoute_1 = __importDefault(require("./user/userRoute"));
const providerRoutes_1 = __importDefault(require("./provider/providerRoutes"));
const adminRoute_1 = __importDefault(require("../../express/routes/admin/adminRoute"));
const routes = (app) => {
    app.use("/api/user", userRoute_1.default);
    app.use("/api/provider", providerRoutes_1.default);
    app.use("/api/admin", adminRoute_1.default);
};
exports.default = routes;
