import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB as string)
        mongoose.set('strictQuery', true)
        console.log("MONGO connected");

    } catch (error: any) {
        console.log("error ", error.message);

        return


    }
}

export default connectDb             