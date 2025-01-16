"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const adminuser_1 = __importDefault(require("./adminuser"));
const adminProvider_1 = __importDefault(require("./adminProvider"));
const adminSettings_1 = __importDefault(require("./adminSettings"));
const jwtAuthenticate_1 = __importDefault(require("../../../../framework/express/middleware/jwtAuthenticate"));
const adminReport_1 = __importDefault(require("./adminReport"));
const adminRoute = express_1.default.Router();
adminRoute.use("/auth", auth_1.default);
adminRoute.use("/user", (0, jwtAuthenticate_1.default)("admin"), adminuser_1.default);
adminRoute.use("/providers", (0, jwtAuthenticate_1.default)("admin"), adminProvider_1.default);
adminRoute.use("/settings", (0, jwtAuthenticate_1.default)("admin"), adminSettings_1.default);
adminRoute.use('/report', (0, jwtAuthenticate_1.default)("admin"), adminReport_1.default);
exports.default = adminRoute;
