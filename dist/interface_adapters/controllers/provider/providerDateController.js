"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
class ProviderDateController {
    constructor(providerDateInteractor) {
        this.providerDateInteractor = providerDateInteractor;
    }
    async addDate(req, res, next) {
        try {
            const { date, id } = req.body;
            const response = await this.providerDateInteractor.addDate(date, id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async addedDates(req, res, next) {
        try {
            const { id } = req.params;
            const response = await this.providerDateInteractor.providerAddedDates(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async updateCount(req, res, next) {
        try {
            const { id, toDo } = req.params;
            console.log(req.params);
            console.log(id, toDo);
            const response = await this.providerDateInteractor.updateCount(id, toDo);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = ProviderDateController;
