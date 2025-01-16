"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminRepo_1 = __importDefault(require("../../../../interface_adapters/repositories/AdminRepo"));
const adminSettingInteractor_1 = __importDefault(require("../../../../usecases/admin/adminSettingInteractor"));
const adminSettings_1 = __importDefault(require("../../../../interface_adapters/controllers/admin/adminSettings"));
const cloudinary_1 = __importDefault(require("../../../../framework/services/cloudinary"));
const multer_1 = __importDefault(require("../../../../framework/services/multer"));
const adminSettingsRoute = express_1.default.Router();
const AdminRepo = new AdminRepo_1.default();
const cloudinary = new cloudinary_1.default();
const adminSettingInteractor = new adminSettingInteractor_1.default(AdminRepo, cloudinary);
const adminSettingsController = new adminSettings_1.default(adminSettingInteractor);
adminSettingsRoute.post("/vehicletype", adminSettingsController.adminSettings.bind(adminSettingsController));
adminSettingsRoute.post("/addbrand", adminSettingsController.addBrand.bind(adminSettingsController));
adminSettingsRoute.get("/settingsDatas", adminSettingsController.getAllSettingsDatas.bind(adminSettingsController));
adminSettingsRoute.post("/addservices", multer_1.default.single("files"), adminSettingsController.addGeneralServiceOrRoadAssistanceServices.bind(adminSettingsController));
adminSettingsRoute.patch("/addSubtype", adminSettingsController.addSubType.bind(adminSettingsController));
adminSettingsRoute.delete("/deletesubtype", adminSettingsController.deleteSubType.bind(adminSettingsController));
adminSettingsRoute.patch("/editservicename/:id", adminSettingsController.editServiceName.bind(adminSettingsController));
exports.default = adminSettingsRoute;
