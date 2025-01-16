import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
    console.log("env",process.env.MONGODB);
    try {
      
        
        await mongoose.connect(process.env.MONGODB+"")
         mongoose.set('strictQuery', true)
        console.log("MONGO connected");

    } catch (error: any) {
        console.log("env",process.env.MONGODB);
        console.log("error ", error.message);
        return


    }     
} 

export default connectDb               