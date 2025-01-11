import express from "express";
import AdminRepository from "../../../../interface_adapters/repositories/AdminRepo";
import AdminSettingInteractor from "../../../../usecases/admin/adminSettingInteractor";
import AdminSettingController from "../../../../interface_adapters/controllers/admin/adminSettings";
import Cloudinary from "../../../../framework/services/cloudinary";
import upload from "../../../../framework/services/multer";
const adminSettingsRoute = express.Router();
const AdminRepo = new AdminRepository();
const cloudinary = new Cloudinary();
const adminSettingInteractor = new AdminSettingInteractor(
    AdminRepo,
    cloudinary
);
const adminSettingsController = new AdminSettingController(
    adminSettingInteractor
);

adminSettingsRoute.post(
    "/vehicletype",
    adminSettingsController.adminSettings.bind(adminSettingsController)
);
adminSettingsRoute.post(
    "/addbrand",
    adminSettingsController.addBrand.bind(adminSettingsController)
);
adminSettingsRoute.get( 
    "/settingsDatas",
    adminSettingsController.getAllSettingsDatas.bind(adminSettingsController)
);
adminSettingsRoute.post(
    "/addservices",
    upload.single("files"),
    adminSettingsController.addGeneralServiceOrRoadAssistanceServices.bind(
        adminSettingsController
    )
);
adminSettingsRoute.patch(
    "/addSubtype",
    adminSettingsController.addSubType.bind(adminSettingsController)
);
adminSettingsRoute.delete(
    "/deletesubtype",
    adminSettingsController.deleteSubType.bind(adminSettingsController)
);
adminSettingsRoute.patch(
    "/editservicename/:id",
    adminSettingsController.editServiceName.bind(adminSettingsController)
);

export default adminSettingsRoute;
