import { Schema, model } from "mongoose";
import {
  servicetypeSchemaModel,
  subtypeSchemaModel,
} from "../../entities/rules/admin";

const subtypeSchema = new Schema<subtypeSchemaModel>(
  {
    type: { type: String },
  },
  { _id: true }
);
const serviceTypeSchema = new Schema<servicetypeSchemaModel>({
  category: { type: String, required: true },
  serviceType: { type: String, required: true },
  imageUrl: { type: String, required: true },
  subTypes: [subtypeSchema],
});

const ServiceTypeModel = model<servicetypeSchemaModel>(
  "ServiceType",
  serviceTypeSchema
);

export default ServiceTypeModel;
