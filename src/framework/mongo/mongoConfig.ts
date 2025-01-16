import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
    try {
        console.log("env",process.env.MONGODB);
        
        await mongoose.connect(process.env.MONGODB+"")
         mongoose.set('strictQuery', true)
        console.log("MONGO connected");

    } catch (error: any) {
        console.log("error ", error.message);
        return


    }    
} 

export default connectDb               