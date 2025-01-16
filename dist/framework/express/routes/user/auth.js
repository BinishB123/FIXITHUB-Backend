"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRepo_1 = __importDefault(require("../../../../interface_adapters/repositories/userRepo"));
const mailer_1 = __importDefault(require("../../../services/mailer"));
const auth_1 = __importDefault(require("../../../../usecases/user/auth"));
const auth_2 = __importDefault(require("../../../../interface_adapters/controllers/user/auth"));
const jwt_1 = __importDefault(require("../../../services/jwt"));
const jwtAuthenticate_1 = __importDefault(require("../../../../framework/express/middleware/jwtAuthenticate"));
// starting
const userAuthRouter = express_1.default.Router();
const respository = new userRepo_1.default();
const mailer = new mailer_1.default();
const jwtServices = new jwt_1.default(process.env.ACCESSTOKENKEY + "", process.env.REFRESHTOKENKEY + "");
const userAuthInteractor = new auth_1.default(respository, mailer, jwtServices);
const controller = new auth_2.default(userAuthInteractor);
//controllers
userAuthRouter.post("/sendotp", controller.sendotpController.bind(controller));
userAuthRouter.post("/verify&signup", controller.verifyandSignup.bind(controller));
userAuthRouter.delete("/logout", controller.logot.bind(controller));
userAuthRouter.post("/login", controller.signIn.bind(controller));
userAuthRouter.get("/checker", (0, jwtAuthenticate_1.default)("user"), controller.checker.bind(controller));
userAuthRouter.get('/getBrands', controller.getBrands.bind(controller));
exports.default = userAuthRouter;
