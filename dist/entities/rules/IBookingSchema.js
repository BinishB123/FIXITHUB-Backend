"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.BookingStatus = void 0;
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["Pending"] = "pending";
    BookingStatus["Confirmed"] = "confirmed";
    BookingStatus["InProgress"] = "inprogress";
    BookingStatus["OutForDelivery"] = "outfordelivery";
    BookingStatus["Completed"] = "completed";
    BookingStatus["Cancelled"] = "cancelled";
    BookingStatus["OnHold"] = "onhold";
    BookingStatus["Failed"] = "failed";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Pending"] = "pending";
    PaymentStatus["Paid"] = "paid";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
