import express from "express";
import BookingController from "../../../../interface_adapters/controllers/user/bookingContoller";
import UserServiceInteractor from "../../../../usecases/user/userService";
import UserRepository from "../../../../interface_adapters/repositories/userRepo";
import StripePayment from "../../../../framework/services/stripe";

const BookingRoute = express.Router();
const userRepo = new UserRepository();
const stripe = new StripePayment();
const serviceInter = new UserServiceInteractor(userRepo, stripe);
const bookingContoller = new BookingController(serviceInter, stripe);

BookingRoute.get(
    "/succesBooking",
    bookingContoller.SuccessBooking.bind(bookingContoller)
);
BookingRoute.get(
    "/fullpaymentsuccess/:docid",
    bookingContoller.afterFullpaymentDone.bind(bookingContoller)
);

export default BookingRoute;
