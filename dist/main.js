"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./framework/app"));
const mongoConfig_1 = __importDefault(require("./framework/mongo/mongoConfig"));
(0, mongoConfig_1.default)();
app_1.default.listen(3000, () => {
    console.log("server started on port 3000");
});
