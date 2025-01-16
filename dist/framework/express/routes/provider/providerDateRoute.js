"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const providerRepo_1 = __importDefault(require("../../../../interface_adapters/repositories/providerRepo"));
const providerDateInteractor_1 = __importDefault(require("../../../../usecases/provider/providerDateInteractor"));
const providerDateController_1 = __importDefault(require("../../../../interface_adapters/controllers/provider/providerDateController"));
const providerDateRoute = express_1.default.Router();
const repository = new providerRepo_1.default();
const interactor = new providerDateInteractor_1.default(repository);
const providerDateController = new providerDateController_1.default(interactor);
providerDateRoute.post("/adddate", providerDateController.addDate.bind(providerDateController));
providerDateRoute.get("/getaddeddates/:id", providerDateController.addedDates.bind(providerDateController));
providerDateRoute.patch("/updateCount/:id/:toDo", providerDateController.updateCount.bind(providerDateController));
exports.default = providerDateRoute;
