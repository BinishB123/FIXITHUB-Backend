import express from "express";
import UserRepository from "../../../../interface_adapters/repositories/userRepo";
import UserProfileInteractor from "../../../../usecases/user/userProfileInteractor";
import UserProfileController from "../../../../interface_adapters/controllers/user/userProfileController";
import Cloudinary from "../../../../framework/services/cloudinary";
import upload from "../../../../framework/services/multer";

const userprofileRouter = express.Router()
const respository = new UserRepository()
const interactor = new UserProfileInteractor(respository)
const cloudinary = new Cloudinary()
const userProfileController = new UserProfileController(interactor,cloudinary)

userprofileRouter.patch('/updateData/:id',userProfileController.updateData.bind(userProfileController))
userprofileRouter.patch('/updateImage',upload.single("files"),userProfileController.addOrChangePhoto.bind(userProfileController))  

  


export default userprofileRouter
