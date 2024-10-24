import express from 'express'
import ProviderRepository from './../../../../interface_adapters/repositories/providerRepo'
import ProviderProfileInteractor from '../../../../usecases/provider/profileInteractor'
import ProviderProfileController from '../../../../interface_adapters/controllers/provider/providerProfileController'
import Cloudinary from '../../../../framework/services/cloudinary'
import upload from '../../../../framework/services/multer'






const providerProfileRoute = express.Router()
const providerRepo = new ProviderRepository()
const interactor = new ProviderProfileInteractor(providerRepo)
const cloudinary = new Cloudinary()
const providerProfileController = new ProviderProfileController(interactor,cloudinary)

providerProfileRoute.get('/getproviderProfileData',providerProfileController.getDataToProfile.bind(providerProfileController))
providerProfileRoute.patch('/editabout',providerProfileController.editAbout.bind(providerProfileController))
providerProfileRoute.patch('/addlogo',upload.single("files"),providerProfileController.addLogo.bind(providerProfileController))
providerProfileRoute.patch('/updataprofileData',providerProfileController.updateProfile.bind(providerProfileController))


export default providerProfileRoute
