import BookingSchema from "../../entities/rules/IBookingSchema";
import { Schema, model } from "mongoose";

const ServiceBookingSchema = new Schema<BookingSchema>({
    providerId: { type: Schema.Types.ObjectId, ref: "providers", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    date: { type: Schema.Types.ObjectId, ref: "BookingDate", required: true },
    amountPaid: { type: Number },
    vechileType: { type: String, required: true },
    additionalCharge: { type: Number },
    serviceType: {
        type: Schema.Types.ObjectId,
        ref: "ServiceType",
        required: true,
    },
    selectedService: [
        {
            typeId: { type: Schema.Types.ObjectId, ref: "ServiceType" },
            serviceName: { type: String, required: true },
            price: { type: Number, required: true },
        },
    ],
    suggestions: { type: String },
    status: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "inprogress",
            "completed",
            "cancelled",
            "onhold",
            "failed",
        ],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
    vechileDetails: {
        vechileId: { type: String },
        brand: { type: Schema.Types.ObjectId, ref: "brand" },
        model: { type: String },
        fueltype: { type: String },
        kilometer: { type: Number },
    },
    advanceAmount: { type: Number, required: true },
    advance: { type: Boolean, default: true },
    paymentIntentId: { type: String, required: true },
    review: { type: Schema.Types.ObjectId, ref: "Reviews", default: null },
});

const ServiceBookingModel = model("serviceBookings", ServiceBookingSchema);
export default ServiceBookingModel;
