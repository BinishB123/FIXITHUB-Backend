import { Schema, Types, model } from "mongoose";
import { propvidingServicesSchema } from "entities/rules/provider";

const subtypeSchema = new Schema({
    type: { type: String, required: true },
    startingPrice: { type: Number, required: true }
});

const servicesSchema = new Schema({
    typeId: { type: Schema.Types.ObjectId, ref:"ServiceType" ,required: true },
    category: { type: String, required: true },
    subtype: [subtypeSchema]
});

const providingServicesSchema = new Schema<propvidingServicesSchema>({
    workshopId: { type: Schema.Types.ObjectId, ref:"providers", required: true },
    twoWheeler: [servicesSchema],
    fourWheeler: [servicesSchema]
});


const providingServicesModel = model('ProvidingServices', providingServicesSchema);

export default providingServicesModel;
