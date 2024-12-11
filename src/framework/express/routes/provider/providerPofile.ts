import express from 'express'
import ProviderRepository from './../../../../interface_adapters/repositories/providerRepo'
import ProviderProfileInteractor from '../../../../usecases/provider/profileInteractor'
import ProviderProfileController from '../../../../interface_adapters/controllers/provider/providerProfileController'
import Cloudinary from '../../../../framework/services/cloudinary'
import upload from '../../../../framework/services/multer'
import ChatInteractor from '../../../../usecases/common/chatInteractor'
import ChatRepo from '../../../../interface_adapters/repositories/common/ChatRepo'






const providerProfileRoute = express.Router()
const providerRepo = new ProviderRepository()
const interactor = new ProviderProfileInteractor(providerRepo)
const cloudinary = new Cloudinary()
const chatrepo  = new ChatRepo()
const chatinteractor = new ChatInteractor(chatrepo)

const providerProfileController = new ProviderProfileController(interactor,cloudinary,chatinteractor)

providerProfileRoute.get('/getproviderProfileData',providerProfileController.getDataToProfile.bind(providerProfileController))
providerProfileRoute.patch('/editabout',providerProfileController.editAbout.bind(providerProfileController))
providerProfileRoute.patch('/addlogo',upload.single("files"),providerProfileController.addLogo.bind(providerProfileController))
providerProfileRoute.patch('/updataprofileData',providerProfileController.updateProfile.bind(providerProfileController))
providerProfileRoute.get('/getallBrands',providerProfileController.getAllBrands.bind(providerProfileController))
providerProfileRoute.patch('/changepassword',providerProfileController.changePassword.bind(providerProfileController))
providerProfileRoute.patch('/changelogo',upload.single("files") ,providerProfileController.updateLogo.bind(providerProfileController))
providerProfileRoute.get('/getchatid/:providerId/:userId',providerProfileController.getChatId.bind(providerProfileController))
providerProfileRoute.get('/getonetonechat/:chatid',providerProfileController.getOneToneChat.bind(providerProfileController))

export default providerProfileRoute
