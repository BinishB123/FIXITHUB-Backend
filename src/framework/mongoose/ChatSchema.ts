import { IChat } from "../../entities/rules/IchatSchema";
import mongoose, { Schema, model } from "mongoose";


const chatSchema = new Schema<IChat>(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "providers", 
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
    latestMessage:{
      type:mongoose.Types.ObjectId,
      ref:"messages",    
    }
  },
  {
    timestamps: true,
  }
);


const chatModel = model("Chat", chatSchema);

export default chatModel;