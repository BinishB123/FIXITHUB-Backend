import express from "express";
import UserRepository from "../../../../interface_adapters/repositories/userRepo";
import Mailer from "../../../services/mailer";
import UserAuthInteractor from "../../../../usecases/user/auth";
import AuthController from "../../../../interface_adapters/controllers/user/auth";
import JwtServices from "../../../services/jwt";
import verification from "../../../../framework/express/middleware/jwtAuthenticate";

// starting
const userAuthRouter = express.Router();
const respository = new UserRepository();
const mailer = new Mailer();
const jwtServices = new JwtServices(
    process.env.ACCESSTOKENKEY + "",
    process.env.REFRESHTOKENKEY + ""
);
const userAuthInteractor = new UserAuthInteractor(
    respository,
    mailer,
    jwtServices
);
const controller = new AuthController(userAuthInteractor);

//controllers
userAuthRouter.post("/sendotp", controller.sendotpController.bind(controller));
userAuthRouter.post(
    "/verify&signup",
    controller.verifyandSignup.bind(controller)
);
userAuthRouter.delete("/logout", controller.logot.bind(controller));
userAuthRouter.post("/login", controller.signIn.bind(controller));
userAuthRouter.get(
    "/checker",
    verification("user"),
    controller.checker.bind(controller)
);

userAuthRouter.get('/getBrands',controller.getBrands.bind(controller))

export default userAuthRouter;
