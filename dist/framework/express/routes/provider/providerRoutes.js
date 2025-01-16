"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../provider/auth"));
const providerAddService_1 = __importDefault(require("./providerAddService"));
const jwtAuthenticate_1 = __importDefault(require("../../../../framework/express/middleware/jwtAuthenticate"));
const providerPofile_1 = __importDefault(require("./providerPofile"));
const express_1 = __importDefault(require("express"));
const providerDateRoute_1 = __importDefault(require("./providerDateRoute"));
const providerServiceBookingRoute_1 = __importDefault(require("./providerServiceBookingRoute"));
const providerRouter = express_1.default.Router();
providerRouter.use("/auth", auth_1.default);
providerRouter.use("/addservice", (0, jwtAuthenticate_1.default)("provider"), providerAddService_1.default);
providerRouter.use("/profile", (0, jwtAuthenticate_1.default)("provider"), providerPofile_1.default);
providerRouter.use("/bookings", (0, jwtAuthenticate_1.default)("provider"), providerDateRoute_1.default);
providerRouter.use("/servicebooking", (0, jwtAuthenticate_1.default)("provider"), providerServiceBookingRoute_1.default);
exports.default = providerRouter;
