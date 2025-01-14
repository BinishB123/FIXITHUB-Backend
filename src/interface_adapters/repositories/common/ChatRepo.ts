import chatModel from "../../../framework/mongoose/ChatSchema";
import { IChatRepo } from "../../../entities/irepositeries/IchatRepo";
import mongoose from "mongoose";
import CustomError from "../../../framework/services/errorInstance";
import { IChatingUser } from "../../../entities/rules/IchatSchema";
import messageModel from "../../../framework/mongoose/messageSchema";
import userModel from "../../../framework/mongoose/userSchema";
import HttpStatus from "../../../entities/rules/statusCode";
import providerModel from "../../../framework/mongoose/providerSchema";

class ChatRepo implements IChatRepo {
  constructor() { }
  async getChatid(
    providerId: string,
    userId: string
  ): Promise<{ success?: boolean; id?: string }> {
    try {
      const chatExist = await chatModel.findOne({
        providerId: new mongoose.Types.ObjectId(providerId),
        userId: new mongoose.Types.ObjectId(userId),
      });
      if (chatExist) {
        return { success: true, id: chatExist._id + "" };
      } else {
        const createChat = {
          providerId: providerId,
          userId: userId,
        };
        const create = await chatModel.create(createChat);
        return { success: true, id: create._id + "" };
      }
    } catch (error: any) {
      console.log("err", error);

      throw new CustomError(error.message, error.statusCode);
    }
  }

  async getChatOfOneToOne(
    chatId: string,
    whoWantsData: "user" | "provider" | string
  ): Promise<{ success?: boolean; data?: IChatingUser }> {
    try {
      const update = await messageModel.updateMany(
        {
          $and: [
            { chatId: new mongoose.Types.ObjectId(chatId) },
            { sender: whoWantsData === "user" ? "provider" : "user" },
          ],
        },
        { $set: { seen: true } }
      );

      const [chatBetweenUsers] = await chatModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(chatId) } },
        {
          $lookup: {
            from: "providers",
            localField: "providerId",
            foreignField: "_id",
            as: "provider",
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "_id",
            foreignField: "chatId",
            as: "messages",
          },
        },
        { $unwind: "$user" },
        { $unwind: "$provider" },
        {
          $project: {
            _id: 1,
            messages: 1,
            "user.name": 1,
            "user.logoUrl": 1,
            "user._id": 1,
            "provider._id": 1,
            "provider.workshopName": 1,
            "provider.logoUrl": 1,
          },
        },
      ]);

      return { success: true, data: chatBetweenUsers };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async updateChats(
    topassChat: string,
    whotosendthesechatid: string
  ): Promise<{ success?: boolean; chats?: IChatingUser[] }> {
    try {
      const data: IChatingUser[] = await chatModel.aggregate([
        {
          $match: {
            [`${topassChat === "user" ? "userId" : "providerId"}`]:
              new mongoose.Types.ObjectId(whotosendthesechatid),
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "latestMessage",
            foreignField: "_id",
            as: "newMessage",
          },
        },
        { $unwind: { path: "$newMessage", preserveNullAndEmptyArrays: true } },
        { $sort: { "newMessage.createdAt": -1 } },
        {
          $lookup: {
            from: `${topassChat === "user" ? "providers" : "users"}`,
            localField: `${topassChat === "user" ? "providerId" : "userId"}`,
            foreignField: "_id",
            as: `${topassChat === "user" ? "provider" : "user"}`,
          },
        },
        {
          $unwind: {
            path: `${topassChat === "user" ? "$provider" : "$user"}`,
          },
        },
        {
          $project: {
            _id: 1,
            ...(topassChat === "user"
              ? {
                "provider._id": 1,
                "provider.workshopName": 1,
                "provider.logoUrl": 1,
              }
              : {
                "user.name": 1,
                "user.logoUrl": 1,
                "user._id": 1,
              }),
            "newMessage.message": 1,
            "newMessage.updatedAt": 1,
          },
        },
      ]);

      return { success: true, chats: data ? data : [] };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async fetchChats(
    whom: string,
    id: string
  ): Promise<{ success?: boolean; chats: IChatingUser[] }> {
    try {
      const data: IChatingUser[] = await chatModel.aggregate([
        {
          $match: {
            [`${whom === "user" ? "userId" : "providerId"}`]:
              new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "latestMessage",
            foreignField: "_id",
            as: "newMessage",
          },
        },
        { $unwind: { path: "$newMessage", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: `${whom === "user" ? "providers" : "users"}`,
            localField: `${whom === "user" ? "providerId" : "userId"}`,
            foreignField: "_id",
            as: `${whom === "user" ? "provider" : "user"}`,
          },
        },
        {
          $unwind: {
            path: `${whom === "user" ? "$provider" : "$user"}`,
          },
        },
        {
          $project: {
            _id: 1,
            ...(whom === "user"
              ? {
                "provider._id": 1,
                "provider.workshopName": 1,
                "provider.logoUrl": 1,
              }
              : {
                "user.name": 1,
                "user.logoUrl": 1,
                "user._id": 1,
              }),
            "newMessage.message": 1,
            "newMessage.updatedAt": 1,
          },
        },
      ]);

      return { success: true, chats: data };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async addNewMessage(
    sender: string,
    chatId: string,
    message: string
  ): Promise<{ success?: boolean; messageCreated: any }> {
    try {
      const createdMesage = await messageModel.create({
        sender: sender,
        chatId: chatId,
        message: message, 
      });
      const update = await chatModel.updateOne({_id:new mongoose.Types.ObjectId(chatId)},{
        latestMessage: createdMesage._id,
      });
      
      return { success: true, messageCreated: createdMesage };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async liveMessageSeen(messageId: string): Promise<{ success?: boolean }> {
    try {
      const updateOne = await messageModel.updateOne(
        { _id: new mongoose.Types.ObjectId(messageId) },
        {
          $set: {
            seen: true,
          },
        }
      );
      if (updateOne.modifiedCount === 0) {
        throw new CustomError("", HttpStatus.NO_CONTENT);
      }
      return { success: true };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async getCalleData(
    id: string,
    providerOrUser: string
  ): Promise<{
    data: { name?: string; logUrl?: string; workshopName?: string };
  }> {
    try {
      const [Data] =
        providerOrUser === "user"
          ? await userModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $project: { _id: 0, name: 1, logoUrl: 1 } },
          ])
          : await providerModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            { $project: { _id: 0, workshopName: 1, logoUrl: 1 } },
          ]);
      console.log(Data);

      return { data: Data };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }
}

export default ChatRepo;
