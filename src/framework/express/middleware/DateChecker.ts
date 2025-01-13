import { NextFunction, Request, Response } from "express";
import BookingDateModel from "../../../framework/mongoose/BookingDates";
import CustomError from "../../../framework/services/errorInstance";
import HttpStatus from "../../../entities/rules/statusCode";
import mongoose, { mongo } from "mongoose";

const CheckerDatesIsThereOrNot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {  
  try {
    const idOfdDate: string = req.body.idOfdDate;
    const date = await BookingDateModel.findOne({
      _id: new mongoose.Types.ObjectId(idOfdDate),
    });

    if (!date) {
      throw new CustomError(
        "Something went wrong Select Another Date",
        HttpStatus.NOT_FOUND
      );
    }
    if (date?.count === 0) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: "Date No Longer Available" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default CheckerDatesIsThereOrNot;
