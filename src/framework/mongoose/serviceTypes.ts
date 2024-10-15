import { Schema, model } from "mongoose";
import { servicetypeSchema } from "../../entities/rules/admin";

const serviceTypeSchema = new Schema<servicetypeSchema>({
  category: { type: String, required: true },
  serviceType: { type: String, required: true },
  imageUrl: { type: String, required: true },
  subTypes: { type: [String] },
});

const ServiceTypeModel = model<servicetypeSchema>(
  "ServiceType",
  serviceTypeSchema
);

export default ServiceTypeModel;
