"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
class AdminSettingInteractor {
    constructor(adminRepo, Cloudinary) {
        this.adminRepo = adminRepo;
        this.Cloudinary = Cloudinary;
    }
    async adminAddvehicleType(type) {
        try {
            const exist = await this.adminRepo.vehicleTypealreadyExistOrNot(type);
            if (!exist.success) {
                return { success: false, message: "409" };
            }
            const adminRepovehicleTypeResponse = await this.adminRepo.adminSettingsAddvehicleType(type);
            if (adminRepovehicleTypeResponse.success) {
                return { success: true };
            }
            return {
                success: false,
                message: "creation failed something went wrong",
            };
        }
        catch (error) {
            return { success: false };
        }
    }
    async adminAddBrand(brand) {
        try {
            const exist = await this.adminRepo.brandExistOrNot(brand);
            if (!exist.success) {
                return { success: false, message: "409" };
            }
            const response = await this.adminRepo.adminSettingAddBrand(brand);
            if (response.success) {
                return { success: true, message: "created" };
            }
            return { success: false, message: "creation failed" };
        }
        catch (error) {
            return { success: false };
        }
    }
    async admingetAllSettingsDatas() {
        try {
            const response = await this.adminRepo.settingsDatas();
            if (!response.success) {
                return { success: false };
            }
            return {
                success: true,
                brands: response.brands,
                generalServices: response.generalServices,
                roadAssistance: response.roadAssistance,
            };
        }
        catch (error) {
            return { success: false };
        }
    }
    async addGeneralserviceOrRoadAssistance(data) {
        try {
            const exist = await this.adminRepo.checkserviceAllreadyExistOrNot(data.servicetype);
            if (exist.success) {
                return { success: false, message: "409" };
            }
            if (data.image instanceof Buffer) {
                const responseCloudinary = await this.Cloudinary.uploadToCloudinary(data.image, "FixitHub", "FixithubImages");
                if (!responseCloudinary.success) {
                    return { success: false };
                }
                const response = await this.adminRepo.addGeneralserviceOrRoadAssistance({
                    category: data.category,
                    servicetype: data.servicetype,
                    imageUrl: responseCloudinary.url ? responseCloudinary.url : "",
                });
                if (!response.success) {
                    return { success: response.success, message: response.message };
                }
                return {
                    success: response.success,
                    message: response.message,
                    created: response.created,
                };
            }
            return { success: false, message: "something went wrong" };
        }
        catch (error) {
            return { success: false };
        }
    }
    async addSubType(data) {
        try {
            const response = await this.adminRepo.addOrUpdateSubType(data);
            if (!response.success) {
                return response;
            }
            return response;
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async deleteSubType(data) {
        try {
            const response = await this.adminRepo.deleteSubType(data);
            return response;
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async editServiceName(data) {
        try {
            const response = await this.adminRepo.editServiceName(data);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = AdminSettingInteractor;
