import mongoose, { Schema , Types, model} from "mongoose";
import { ProviderModeSchema } from "../../entities/rules/provider";






const providerSchema = new Schema<ProviderModeSchema>({
    workshopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    workshopDetails: { type: Object, required: true },
    blocked: { type: Boolean, required: true, default: false },
    requestAccept: { type: Boolean, required: true, default: false },
    supportedBrands:[{
        brand:{type:Schema.Types.ObjectId ,ref: 'brand'}
    }]
   
});

const providerModel = model("providers",providerSchema)

export default providerModel
