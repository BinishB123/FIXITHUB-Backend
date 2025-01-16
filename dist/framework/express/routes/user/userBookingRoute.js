"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingContoller_1 = __importDefault(require("../../../../interface_adapters/controllers/user/bookingContoller"));
const userService_1 = __importDefault(require("../../../../usecases/user/userService"));
const userRepo_1 = __importDefault(require("../../../../interface_adapters/repositories/userRepo"));
const stripe_1 = __importDefault(require("../../../../framework/services/stripe"));
const BookingRoute = express_1.default.Router();
const userRepo = new userRepo_1.default();
const stripe = new stripe_1.default();
const serviceInter = new userService_1.default(userRepo, stripe);
const bookingContoller = new bookingContoller_1.default(serviceInter, stripe);
BookingRoute.get("/succesBooking", bookingContoller.SuccessBooking.bind(bookingContoller));
BookingRoute.get("/fullpaymentsuccess/:docid", bookingContoller.afterFullpaymentDone.bind(bookingContoller));
exports.default = BookingRoute;
