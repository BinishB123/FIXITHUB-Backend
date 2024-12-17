import { IChatRepo } from "../../entities/irepositeries/IchatRepo";
import { IChatInteractor } from "../../entities/common/IChatInteractor";
import CustomError from "../../framework/services/errorInstance";
import { IChatingUser } from "entities/rules/IchatSchema";



class ChatInteractor implements IChatInteractor {
    constructor(private readonly chatRepo: IChatRepo) { }

    async getChatid(providerId: string, userId: string): Promise<{ success?: boolean; id?: string; }> {
        try {

            const response = await this.chatRepo.getChatid(providerId, userId)
            return response
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async getChatOfOneToOne(chatId: string): Promise<{ success?: boolean; data?: IChatingUser; }> {
        try {
            const response = await this.chatRepo.getChatOfOneToOne(chatId)
            return response
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async fetchChats(whom: string, id: string): Promise<{ success?: boolean; chats: IChatingUser[]; }> {
        try {
            const response = await this.chatRepo.fetchChats(whom, id)
            return response
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
    }
    async updateChats(topassChat: string, whotosendthesechatid: string): Promise<{ success?: boolean; chats?: IChatingUser[]; }> {
        try {
            const response = await this.chatRepo.updateChats(topassChat, whotosendthesechatid)
            return response
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async addNewMessage(sender: string, chatId: string, message: string): Promise<{ success?: boolean; messageCreated: any; }> {
        try {
            const response = await this.chatRepo.addNewMessage(sender, chatId, message)
            return response
        } catch (error: any) {
            console.log(error.message);

            throw new CustomError(error.message, error.statusCode)
        }
    }

    async liveMessageSeen(messageId: string): Promise<{ success?: boolean; }> {
        try {
            const response = await this.chatRepo.liveMessageSeen(messageId)
            return response
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async getCalleData(id: string, providerOrUser: string): Promise<{ data: { name?: string; logUrl?: string; workshopName?: string; }; }> {
        try {
            const response = await  this.chatRepo.getCalleData(id,providerOrUser)
            return response
            
        } catch (error:any) {
            throw new CustomError(error.message,error.statusCode)
        }
    }

}

export default ChatInteractor