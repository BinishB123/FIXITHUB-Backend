"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BookingController {
    constructor(UserServiceInteractor, stripe) {
        this.UserServiceInteractor = UserServiceInteractor;
        this.stripe = stripe;
    }
    async SuccessBooking(req, res, next) {
        try {
            const session_id = req.query.session_id + "";
            const retrievePaymentIntent = await this.stripe.retrieveSession(session_id);
            const data = req.session.dataRequiredForBooking;
            req.session.dataRequiredForBooking = undefined;
            const response = await this.UserServiceInteractor.SuccessBooking(data, retrievePaymentIntent.paymentInentID + "");
            res.redirect(process.env.SUCCESS_URL);
        }
        catch (error) {
            next(error);
        }
    }
    async afterFullpaymentDone(req, res, next) {
        try {
            const { docid } = req.params;
            const response = await this.UserServiceInteractor.afterFullpaymentDone(docid);
            res.redirect(process.env.SERVICE_HISTORY + `?id=${docid}`);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = BookingController;
