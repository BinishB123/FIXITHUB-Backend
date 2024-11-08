import { Schema, model } from "mongoose";
import user from "entities/rules/user";

const userSchema = new Schema<user>({
    name: { type: String, required: true },
    mobile: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    logoUrl:{type:String},
    blocked:{type:Boolean,required:true,default:false}
})

const userModel = model('users', userSchema)

export default userModel