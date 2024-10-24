import { Schema, Types, model } from "mongoose";
import { propvidingServicesSchema } from "entities/rules/provider";

const providingServicesSchema = new Schema<propvidingServicesSchema>({
  workshopId: { type: Schema.Types.ObjectId, ref: "providers", required: true },
  twoWheeler: [
    {
      typeId: {
        type: Schema.Types.ObjectId,
        ref: "ServiceType",
        required: true,
      },
      category: { type: String, required: true },
      subtype: [
        {
          type: { type: Schema.Types.ObjectId,ref: "ServiceType" ,required: true },
          startingPrice: { type: Number, required: true },
        },
      ],
    },
  ],
  fourWheeler: [
    {
      typeId: {
        type: Schema.Types.ObjectId,
        ref: "ServiceType",
        required: true,
      },
      category: { type: String, required: true },
      subtype: [
        {
          type: {type: Schema.Types.ObjectId,ref: "ServiceType" , required: true },
          startingPrice: { type: Number, required: true },
        },
      ],
    },
  ],
});

const providingServicesModel = model(
  "ProvidingServices",
  providingServicesSchema
);

export default providingServicesModel;
