"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
class ProviderAddServiceController {
    constructor(providerServiceInteractor) {
        this.providerServiceInteractor = providerServiceInteractor;
    }
    async getProviderAllService(req, res) {
        const id = req.query.id || "";
        const number = req.query.type || "";
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Provider ID is required.",
            });
        }
        try {
            const response = await this.providerServiceInteractor.getProviderServices(id, parseInt(number));
            res
                .status(response.success ? statusCode_1.default.OK : statusCode_1.default.NOT_FOUND)
                .json(response);
        }
        catch (error) {
            console.error("Error fetching provider services:", error);
            res.status(500).json({
                success: false,
                message: "An error occurred while fetching provider services.",
            });
        }
    }
    async addGeneralOrRoadService(req, res) {
        try {
            const { id, typeid, category, vehicleType } = req.body;
            const data = {
                providerid: id,
                typeid: typeid,
                category: category,
                vehicleType: vehicleType,
            };
            const response = await this.providerServiceInteractor.addGeneralOrRoadService(data);
            if (!response.success) {
                if (response.message === "500") {
                    return res
                        .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                        .json({ message: "internal server Error" });
                }
                return res
                    .status(statusCode_1.default.Unprocessable_Entity)
                    .json({ message: "creation failed" });
            }
            return res.status(statusCode_1.default.OK).json({ message: "ok" });
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal Server error" });
        }
    }
    async removeGeneralOrRoadService(req, res, next) {
        try {
            const { typeid, workshopId, vehicleType } = req.params;
            const response = await this.providerServiceInteractor.removeGeneralOrRoadService({
                workshopId,
                typeid,
                vehicleType,
            });
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async addSubTypes(req, res) {
        try {
            const { serviceid, providerId, newSubtype } = req.body;
            const response = await this.providerServiceInteractor.addSubTypes(providerId, serviceid, newSubtype);
            if (response.success) {
                return res.status(statusCode_1.default.OK).json({ message: "success" });
            }
            return res
                .status(statusCode_1.default.Unprocessable_Entity)
                .json({ message: "failed" });
        }
        catch (error) {
            console.log("errr", error.message);
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "internal server Error" });
        }
    }
    async editSubType(req, res) {
        try {
            const { serviceid, providerId, newSubtype } = req.body;
            const response = await this.providerServiceInteractor.editSubType(providerId, serviceid, newSubtype);
            if (response.success) {
                return res
                    .status(statusCode_1.default.OK)
                    .json({ success: true, message: "success" });
            }
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "failed" });
        }
    }
    async deleteSubTpe(req, res) {
        try {
            const serviceid = req.query.serviceid;
            const providerId = req.query.providerId;
            const type = req.query.type;
            const servicetype = req.query.servicetype;
            const newsubtype = {
                type: servicetype,
            };
            const response = await this.providerServiceInteractor.deleteSubtype(providerId, serviceid, newsubtype, type);
            if (response.success) {
                return res
                    .status(statusCode_1.default.OK)
                    .json({ success: true, message: "success" });
            }
            return res
                .status(statusCode_1.default.FORBIDDEN)
                .json({ success: false, message: "failed" });
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "failed" });
        }
    }
    async getallBrands(req, res) {
        try {
            const id = req.query.id;
            const response = await this.providerServiceInteractor.getallBrands(id);
            if (!response.succes) {
                if (response.message === "500") {
                    return res.status(statusCode_1.default.INTERNAL_SERVER_ERROR).json(response);
                }
            }
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            return res
                .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "failed" });
        }
    }
    async addBrands(req, res) {
        try {
            const { id, brandid } = req.body;
            const response = await this.providerServiceInteractor.addBrands({
                id,
                brandid,
            });
            if (response.success) {
                return res.status(statusCode_1.default.OK).json({ success: "added" });
            }
            else {
                return res
                    .status(statusCode_1.default.Unprocessable_Entity)
                    .json({ message: "failed" });
            }
        }
        catch (error) {
            return res.status(statusCode_1.default.INTERNAL_SERVER_ERROR).json(express_1.response);
        }
    }
    async deleteBrand(req, res) {
        try {
            const { id, brandid } = req.body;
            const response = await this.providerServiceInteractor.deleteBrands({
                id,
                brandid,
            });
            if (response.success) {
                return res.status(statusCode_1.default.OK).json({ success: "added" });
            }
            else {
                return res
                    .status(statusCode_1.default.Unprocessable_Entity)
                    .json({ message: "failed" });
            }
        }
        catch (error) {
            return res.status(statusCode_1.default.INTERNAL_SERVER_ERROR).json(express_1.response);
        }
    }
}
exports.default = ProviderAddServiceController;
