import BookingSchema from "../../entities/rules/IBookingSchema";
import { Schema, model } from "mongoose";


const ServiceBookingSchema = new Schema<BookingSchema>({
    providerId: { type: Schema.Types.ObjectId, ref: "providers", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    date: { type: Schema.Types.ObjectId, ref: 'BookingDate', required: true },
    amountPaid: { type: Number },
    vechileType: { type: String, required: true },
    additionalCharge: { type: Number },
    serviceType: { type: Schema.Types.ObjectId, ref: "ServiceType", required: true },
    selectedService: [
        {
            typeId: { type: Schema.Types.ObjectId, ref: "ServiceType", required: true },
            serviceName: { type: String },
            price: { type: Number }
        }
    ],
    suggestions: { type: String },
    status: {
        type: String,
        enum: ["pending", "confirmed", "inprogress", "outfordelivery", "completed", "cancelled", "onhold", "failed"],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    },
    vechileDetails: {
        vechileId: { type: String },
        brand: { type: Schema.Types.ObjectId, ref: "brand" },
        model: { type: String },
        fueltype: { type: String },
        kilometer: { type: Number }
    },
    bookingfee: { type: Number, required: true },
    bookingfeeStatus: { type: Boolean, required: true },
    paymentIntentId:{type:String,required:true}

})

const ServiceBookingModel = model("serviceBookings", ServiceBookingSchema)
export default ServiceBookingModel
