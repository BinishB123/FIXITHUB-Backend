"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ChatSchema_1 = __importDefault(require("../../../framework/mongoose/ChatSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorInstance_1 = __importDefault(require("../../../framework/services/errorInstance"));
const messageSchema_1 = __importDefault(require("../../../framework/mongoose/messageSchema"));
const userSchema_1 = __importDefault(require("../../../framework/mongoose/userSchema"));
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
const providerSchema_1 = __importDefault(require("../../../framework/mongoose/providerSchema"));
class ChatRepo {
    constructor() { }
    async getChatid(providerId, userId) {
        try {
            const chatExist = await ChatSchema_1.default.findOne({
                providerId: new mongoose_1.default.Types.ObjectId(providerId),
                userId: new mongoose_1.default.Types.ObjectId(userId),
            });
            if (chatExist) {
                return { success: true, id: chatExist._id + "" };
            }
            else {
                const createChat = {
                    providerId: providerId,
                    userId: userId,
                };
                const create = await ChatSchema_1.default.create(createChat);
                return { success: true, id: create._id + "" };
            }
        }
        catch (error) {
            console.log("err", error);
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getChatOfOneToOne(chatId, whoWantsData) {
        try {
            const update = await messageSchema_1.default.updateMany({
                $and: [
                    { chatId: new mongoose_1.default.Types.ObjectId(chatId) },
                    { sender: whoWantsData === "user" ? "provider" : "user" },
                ],
            }, { $set: { seen: true } });
            const [chatBetweenUsers] = await ChatSchema_1.default.aggregate([
                { $match: { _id: new mongoose_1.default.Types.ObjectId(chatId) } },
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
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async updateChats(topassChat, whotosendthesechatid) {
        try {
            const data = await ChatSchema_1.default.aggregate([
                {
                    $match: {
                        [`${topassChat === "user" ? "userId" : "providerId"}`]: new mongoose_1.default.Types.ObjectId(whotosendthesechatid),
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
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async fetchChats(whom, id) {
        try {
            const data = await ChatSchema_1.default.aggregate([
                {
                    $match: {
                        [`${whom === "user" ? "userId" : "providerId"}`]: new mongoose_1.default.Types.ObjectId(id),
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
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async addNewMessage(sender, chatId, message) {
        try {
            const createdMesage = await messageSchema_1.default.create({
                sender: sender,
                chatId: chatId,
                message: message,
            });
            const update = await ChatSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(chatId) }, {
                latestMessage: createdMesage._id,
            });
            return { success: true, messageCreated: createdMesage };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async liveMessageSeen(messageId) {
        try {
            const updateOne = await messageSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(messageId) }, {
                $set: {
                    seen: true,
                },
            });
            if (updateOne.modifiedCount === 0) {
                throw new errorInstance_1.default("", statusCode_1.default.NO_CONTENT);
            }
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getCalleData(id, providerOrUser) {
        try {
            const [Data] = providerOrUser === "user"
                ? await userSchema_1.default.aggregate([
                    { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
                    { $project: { _id: 0, name: 1, logoUrl: 1 } },
                ])
                : await providerSchema_1.default.aggregate([
                    { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
                    { $project: { _id: 0, workshopName: 1, logoUrl: 1 } },
                ]);
            console.log(Data);
            return { data: Data };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = ChatRepo;
