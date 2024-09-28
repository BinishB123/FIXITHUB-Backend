import { Schema , model} from "mongoose";
import { ProviderModel } from "../../entities/rules/provider";


const providerSchema = new Schema<ProviderModel>({
    workshopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    workshopDetails: { type: Object, required: true },
    blocked: { type: Boolean, required: true, default: false },
    requestAccept: { type: Boolean, required: true, default: false }

})

const providerModel = model("providers",providerSchema)

export default providerModel
