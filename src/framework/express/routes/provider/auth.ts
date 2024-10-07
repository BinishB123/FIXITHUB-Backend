import ProviderRepository from "../../../../interface_adapters/repositories/providerRepo";
import Mailer from "../../../../framework/services/mailer";
import ProviderAuthInteractor from "../../../../usecases/provider/auth";
import ProviderAuthController from "../../../../interface_adapters/controllers/provider/providerAuth";
import JwtServices from "../../../services/jwt";
import express from "express";

const providerAuthRouter = express.Router()
const respository = new ProviderRepository()
const mailer = new Mailer()
const jwtServices = new JwtServices(process.env.ACCESSTOKENKEY + "", process.env.REFRESHTOKENKEY + "")
const providerAuthInteractor = new ProviderAuthInteractor(respository, mailer, jwtServices)
const providerAuthController = new ProviderAuthController(providerAuthInteractor)


providerAuthRouter.post('/sendotp', providerAuthController.sendOtp.bind(providerAuthController))
providerAuthRouter.post('/verifyotp', providerAuthController.verifyOtp.bind(providerAuthController))
providerAuthRouter.post('/register', providerAuthController.registerProvider.bind(providerAuthController))
providerAuthRouter.post('/signin', providerAuthController.signInProvider.bind(providerAuthController))
providerAuthRouter.delete('/logout', providerAuthController.logot.bind(providerAuthController))


export default providerAuthRouter


