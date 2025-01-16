"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const userServiceRoute_1 = __importDefault(require("./userServiceRoute"));
const userProfileRoute_1 = __importDefault(require("./userProfileRoute"));
const jwtAuthenticate_1 = __importDefault(require("../../../../framework/express/middleware/jwtAuthenticate"));
const userBookingRoute_1 = __importDefault(require("./userBookingRoute"));
const userRoute = express_1.default.Router();
userRoute.use("/auth", auth_1.default);
userRoute.use("/service", (0, jwtAuthenticate_1.default)("user"), userServiceRoute_1.default);
userRoute.use("/profile", (0, jwtAuthenticate_1.default)("user"), userProfileRoute_1.default);
userRoute.use("/servicebooking", userBookingRoute_1.default);
exports.default = userRoute;
