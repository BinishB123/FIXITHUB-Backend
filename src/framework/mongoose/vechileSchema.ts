import { Schema ,model } from "mongoose";
import { VechileType } from "../../entities/rules/admin";

const vechileSchema = new Schema<VechileType>({
    vechileType:{type:Number,required:true}
})

const vechileModel = model<VechileType>("vechiletype",vechileSchema)
export default vechileModel