import { IReportSchema } from "../../entities/rules/IreportSchema";
import { Schema, model } from "mongoose";

const reportSchema = new Schema<IReportSchema>({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  providerId: { type: Schema.Types.ObjectId, ref: "providers", required: true },
  BookingId: {
    type: Schema.Types.ObjectId,
    ref: "serviceBookings",
    required: true,
  },
  report: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Approved", "Rejected", "Completed"],
    default: "Pending",
  },
});

const reportModel = model("reports", reportSchema);

export default reportModel;
