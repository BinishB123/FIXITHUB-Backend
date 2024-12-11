import { IChat, IMessage } from "../../entities/rules/IchatSchema";
import mongoose, { Schema, model } from "mongoose";





const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: String,
      enum: ["user", "provider"],
      required: true,
    },
    chatId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"chats"

    },
    message: {
      type: String,
      required: true,
      trim:true
    },
    providerdelete: {
      type: Boolean,
      default: false,
    },
    userdelete: {
      type: Boolean,
      default: false,
    },
    seen:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);





const messageModel = model("messages", messageSchema);

export default messageModel;