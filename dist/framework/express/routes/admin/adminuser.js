"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminRepo_1 = __importDefault(require("../../../../interface_adapters/repositories/AdminRepo"));
const adminUser_1 = __importDefault(require("../../../../usecases/admin/adminUser"));
const adminUserController_1 = __importDefault(require("../../../../interface_adapters/controllers/admin/adminUserController"));
const express_1 = __importDefault(require("express"));
const adminUserRouter = express_1.default.Router();
const adminUserRepo = new AdminRepo_1.default();
const adminuserinteractor = new adminUser_1.default(adminUserRepo);
const controller = new adminUserController_1.default(adminuserinteractor);
adminUserRouter.get("/getuser", controller.getUser.bind(controller));
adminUserRouter.patch("/blockAndUnblock", controller.userBlockAndUnblock.bind(controller));
exports.default = adminUserRouter;
