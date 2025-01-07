import { Schema, Types, model } from "mongoose";
import { ReviewSchema } from "../../entities/rules/IreviewSchema";

const images = new Schema(
  {
    url: { type: String },
  },
  { _id: false }
);

const reviewSchema = new Schema<ReviewSchema>({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "serviceBookings",
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  ProviderId: { type: Schema.Types.ObjectId, ref: "providers", required: true },
  ServiceId: {
    type: Schema.Types.ObjectId,
    ref: "ServiceType",
    required: true,
  },
  opinion: { type: String, required: true },
  reply: { type: String, default: null },
  like: { type: Boolean, default: false },
  images: [images],
});

const reviewModel = model("Reviews", reviewSchema);

export default reviewModel;
