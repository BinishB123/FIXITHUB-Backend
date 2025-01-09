import express from "express";
import UserRepository from "../../../../interface_adapters/repositories/userRepo";
import UserProfileInteractor from "../../../../usecases/user/userProfileInteractor";
import UserProfileController from "../../../../interface_adapters/controllers/user/userProfileController";
import Cloudinary from "../../../../framework/services/cloudinary";
import upload from "../../../../framework/services/multer";
import ChatRepo from "../../../../interface_adapters/repositories/common/ChatRepo";
import ChatInteractor from "../../../../usecases/common/chatInteractor";

const userprofileRouter = express.Router();
const respository = new UserRepository();
const interactor = new UserProfileInteractor(respository);
const cloudinary = new Cloudinary();
const chatrepo = new ChatRepo();
const chatinteractor = new ChatInteractor(chatrepo);
const userProfileController = new UserProfileController(
  interactor,
  cloudinary,
  chatinteractor
);

userprofileRouter.patch(
  "/updateData/:id",
  userProfileController.updateData.bind(userProfileController)
);
userprofileRouter.patch(
  "/updateImage",
  upload.single("files"),
  userProfileController.addOrChangePhoto.bind(userProfileController)
);
userprofileRouter.get(
  "/getChatId/:providerId/:userId",
  userProfileController.getChatId.bind(userProfileController)
);
userprofileRouter.post(
  "/getchatofOneToOne/:chatId/:whoWantsData",
  userProfileController.getChatOfOneToOne.bind(userProfileController)
);
userprofileRouter.get(
  "/getchat/:whom/:id",
  userProfileController.fetchChat.bind(userProfileController)
);
userprofileRouter.post(
  "/newmessage",
  userProfileController.addMessage.bind(userProfileController)
);
userprofileRouter.get(
  "/notificationUpdater/:id",
  userProfileController.notificationCountUpdater.bind(userProfileController)
);
userprofileRouter.get(
  "/notificationGetter/:id",
  userProfileController.notificationGetter.bind(userProfileController)
);

userprofileRouter.post(
  "/createReport",
  userProfileController.createReport.bind(userProfileController)
);
userprofileRouter.get(
  "/getreport/:id",
  userProfileController.getReports.bind(userProfileController)
);

export default userprofileRouter;
