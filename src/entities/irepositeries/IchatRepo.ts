import {  IChatingUser } from "../../entities/rules/IchatSchema"






export interface IChatRepo {
    getChatid(providerId:string,userId:string):Promise<{success?:boolean,id?:string}>
    getChatOfOneToOne(chatId:string):Promise<{success?:boolean,data?:IChatingUser}>
    fetchChats(whom:string,id:string):Promise<{success?:boolean,chats:IChatingUser[]}>
    updateChats(topassChat:string,whotosendthesechatid:string):Promise<{success?:boolean,chats?:IChatingUser[]}>
    addNewMessage(sender:string,chatId:string,message:string):Promise<{success?:boolean,messageCreated:any}>
    liveMessageSeen(messageId:string):Promise<{success?:boolean}>
    getCalleData(id:string,providerOrUser:string):Promise<{data:{name?:string,logUrl?:string,workshopName?:string}}>
}