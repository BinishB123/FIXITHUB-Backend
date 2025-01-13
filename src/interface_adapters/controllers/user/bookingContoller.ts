import IStripe from "../../../entities/services/Istripe";
import { IRequiredDataDForBooking } from "../../../entities/rules/user";
import IuserServiceInteractor from "../../../entities/user/IuserServiceInteractor";
import { NextFunction, Request, Response } from "express";

class BookingController {
    constructor(
        private readonly UserServiceInteractor: IuserServiceInteractor,
        private readonly stripe: IStripe
    ) { }

    async SuccessBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const session_id = req.query.session_id + "";
            const retrievePaymentIntent =
                await this.stripe.retrieveSession(session_id);
            const data: IRequiredDataDForBooking = req.session.dataRequiredForBooking;
            req.session.dataRequiredForBooking = undefined;
            const response = await this.UserServiceInteractor.SuccessBooking(
                data,
                retrievePaymentIntent.paymentInentID + ""
            );
            res.redirect(process.env.SUCCESS_URL as string);
        } catch (error) {
            next(error);
        }
    }

    async afterFullpaymentDone(req: Request, res: Response, next: NextFunction) {
        try {
            const { docid } = req.params;
            const response = await this.UserServiceInteractor.afterFullpaymentDone(docid);
            res.redirect(process.env.SERVICE_HISTORY+`?id=${docid}`);
        } catch (error) {
            next(error);
        }
    }
}

export default BookingController;
