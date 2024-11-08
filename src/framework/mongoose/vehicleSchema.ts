import { Schema ,model } from "mongoose";
import { vehicleType } from "../../entities/rules/admin";

const vehicleSchema = new Schema<vehicleType>({
    vehicleType:{type:Number,required:true}
})

const vehicleModel = model<vehicleType>("vehicletype",vehicleSchema)
export default vehicleModel