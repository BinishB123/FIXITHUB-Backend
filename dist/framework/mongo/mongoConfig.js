"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
console.log("ham", process.env.MONGODB);
const connectDb = async () => {
    console.log("env", process.env.MONGODB);
    try {
        await mongoose_1.default.connect(process.env.MONGODB + "");
        mongoose_1.default.set('strictQuery', true);
        console.log("MONGO connected");
    }
    catch (error) {
        console.log("env", process.env.MONGODB);
        console.log("error ", error.message);
        return;
    }
};
exports.default = connectDb;
