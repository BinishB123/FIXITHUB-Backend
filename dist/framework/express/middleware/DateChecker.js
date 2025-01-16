"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BookingDates_1 = __importDefault(require("../../../framework/mongoose/BookingDates"));
const errorInstance_1 = __importDefault(require("../../../framework/services/errorInstance"));
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
const mongoose_1 = __importDefault(require("mongoose"));
const CheckerDatesIsThereOrNot = async (req, res, next) => {
    try {
        const idOfdDate = req.body.idOfdDate;
        const date = await BookingDates_1.default.findOne({
            _id: new mongoose_1.default.Types.ObjectId(idOfdDate),
        });
        if (!date) {
            throw new errorInstance_1.default("Something went wrong Select Another Date", statusCode_1.default.NOT_FOUND);
        }
        if (date?.count === 0) {
            return res
                .status(statusCode_1.default.CONFLICT)
                .json({ message: "Date No Longer Available" });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = CheckerDatesIsThereOrNot;
