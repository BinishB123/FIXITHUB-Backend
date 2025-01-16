"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
class AdminSettingController {
    constructor(adminSettingsInter) {
        this.adminSettingsInter = adminSettingsInter;
    }
    async adminSettings(req, res) {
        try {
            const { type } = req.body;
            const response = await this.adminSettingsInter.adminAddvehicleType(type);
            if (response.success) {
                return res
                    .status(statusCode_1.default.CREATED)
                    .json({ success: true, message: "created" });
            }
            if (!response.success && response.message === "409") {
                return res
                    .status(statusCode_1.default.CONFLICT)
                    .json({ success: false, message: "Type already exist" });
            }
            return res
                .status(statusCode_1.default.BAD_REQUEST)
                .json({ success: false, message: "not created" });
        }
        catch (error) {
            return res.status(statusCode_1.default.INTERNAL_SERVER_ERROR);
        }
    }
    async addBrand(req, res) {
        try {
            const { brand } = req.body;
            const exist = await this.adminSettingsInter.adminAddBrand(brand);
            if (exist.message == "409") {
                return res
                    .status(statusCode_1.default.CONFLICT)
                    .json({ success: false, message: "Brand Already Exist" });
            }
            if (!exist.success) {
                return res
                    .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "failed something went wrong" });
            }
            return res
                .status(statusCode_1.default.CREATED)
                .json({ success: true, message: "Created" });
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "creation failed" });
        }
    }
    async getAllSettingsDatas(req, res) {
        try {
            const response = await this.adminSettingsInter.admingetAllSettingsDatas();
            if (!response.success) {
                return res.status(statusCode_1.default.BAD_REQUEST).json({ success: false });
            }
            return res.status(statusCode_1.default.OK).json({
                success: true,
                brands: response.brands,
                generalservices: response.generalServices,
                roadAssistance: response.roadAssistance,
            });
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ success: false });
        }
    }
    async addGeneralServiceOrRoadAssistanceServices(req, res) {
        try {
            const { category, servicetype } = req.body;
            const image = req.file?.buffer;
            const interactorResponse = await this.adminSettingsInter.addGeneralserviceOrRoadAssistance({
                category,
                servicetype,
                image,
            });
            if (interactorResponse.message === "409") {
                return res.status(statusCode_1.default.CONFLICT).json({
                    success: interactorResponse.success,
                    message: "Service Already exists",
                });
            }
            if (interactorResponse.success) {
                return res.status(statusCode_1.default.CREATED).json(interactorResponse);
            }
            return res
                .status(statusCode_1.default.Unprocessable_Entity)
                .json(interactorResponse);
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "something went wrong" });
        }
    }
    async addSubType(req, res) {
        try {
            const { id, type } = req.body;
            const response = await this.adminSettingsInter.addSubType({ id, type });
            if (!response.success) {
                return res.status(statusCode_1.default.Unprocessable_Entity).json(response);
            }
            return res.status(statusCode_1.default.CREATED).json(response);
        }
        catch (error) {
            return res.status(statusCode_1.default.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteSubType(req, res) {
        try {
            const { id, type } = req.body;
            const response = await this.adminSettingsInter.deleteSubType({
                id,
                type,
            });
            if (response.message === "500") {
                return res
                    .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                    .json({ success: false, message: "can't delete server error" });
            }
            return res
                .status(statusCode_1.default.OK)
                .json({ success: true, message: "Deleted" });
        }
        catch (error) {
            console.log(error);
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "can't delete server error" });
        }
    }
    async editServiceName(req, res, next) {
        try {
            const { id } = req.params;
            const { newName } = req.body;
            if (!newName) {
                return res
                    .status(statusCode_1.default.NOT_FOUND)
                    .json({ message: "something Went Wrong try Again" });
            }
            const response = await this.adminSettingsInter.editServiceName({
                id,
                newName,
            });
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = AdminSettingController;
