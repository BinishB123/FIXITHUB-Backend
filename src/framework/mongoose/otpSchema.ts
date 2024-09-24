import { Schema, Document, model } from "mongoose";

interface IOTP extends Document {
    otp: string,
    userEmail: string,
    createdAt: Date,
    isUsed: boolean
}

const otpSchema = new Schema<IOTP>({
    otp: { type: String, required: true },
    userEmail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: '1m' } },
    isUsed: { type: Boolean, default: false }
})

const otpModel = model('otp', otpSchema)
export default otpModel