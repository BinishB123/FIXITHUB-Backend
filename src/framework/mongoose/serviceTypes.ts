import { Schema, model } from "mongoose";
import { servicetypeSchemaModel } from "../../entities/rules/admin";

const serviceTypeSchema = new Schema<servicetypeSchemaModel>({
  category: { type: String, required: true },
  serviceType: { type: String, required: true },
  imageUrl: { type: String, required: true },
  subTypes: { type: [String] },
});

const ServiceTypeModel = model<servicetypeSchemaModel>(
  "ServiceType",
  serviceTypeSchema
);

export default ServiceTypeModel;
