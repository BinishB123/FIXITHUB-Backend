"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
class ChatInteractor {
    constructor(chatRepo) {
        this.chatRepo = chatRepo;
    }
    async getChatid(providerId, userId) {
        try {
            const response = await this.chatRepo.getChatid(providerId, userId);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getChatOfOneToOne(chatId, whoWantsData) {
        try {
            const response = await this.chatRepo.getChatOfOneToOne(chatId, whoWantsData);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async fetchChats(whom, id) {
        try {
            const response = await this.chatRepo.fetchChats(whom, id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async updateChats(topassChat, whotosendthesechatid) {
        try {
            const response = await this.chatRepo.updateChats(topassChat, whotosendthesechatid);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async addNewMessage(sender, chatId, message) {
        try {
            const response = await this.chatRepo.addNewMessage(sender, chatId, message);
            return response;
        }
        catch (error) {
            console.log(error.message);
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async liveMessageSeen(messageId) {
        try {
            const response = await this.chatRepo.liveMessageSeen(messageId);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getCalleData(id, providerOrUser) {
        try {
            const response = await this.chatRepo.getCalleData(id, providerOrUser);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = ChatInteractor;
