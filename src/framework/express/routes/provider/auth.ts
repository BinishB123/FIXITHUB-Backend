import ProviderRepository from "../../../../interface_adapters/repositories/providerRepo";
import Mailer from "../../../../framework/services/mailer";
import ProviderAuthInteractor from "../../../../usecases/provider/auth";
import ProviderAuthController from "../../../../interface_adapters/controllers/provider/providerAuth";
import express from "express";

const providerAuthRouter = express.Router()
const respository = new ProviderRepository()
const mailer = new Mailer()
const providerAuthInteractor = new ProviderAuthInteractor(respository, mailer)
const providerAuthController = new ProviderAuthController(providerAuthInteractor)

providerAuthRouter.post('/sendotp', providerAuthController.sendOtp.bind(providerAuthController))
providerAuthRouter.post('/verifyotp', providerAuthController.verifyOtp.bind(providerAuthController))


export default providerAuthRouter


