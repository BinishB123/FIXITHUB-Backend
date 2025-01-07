import { ObjectId, Schema, model } from "mongoose";

interface IBookingDates {
    providerid: ObjectId;
    date: Date;
    count: number;
}

const BookingsDatesSchema = new Schema<IBookingDates>({
    providerid: { type: Schema.Types.ObjectId, ref: "providers", required: true },
    date: { type: Date, required: true },
    count: { type: Number, default: 0 },
});

const BookingDateModel = model("BookingDate", BookingsDatesSchema);

export default BookingDateModel;
