
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import ChatRepo from "../../interface_adapters/repositories/common/ChatRepo";
import ChatInteractor from "../../usecases/common/chatInteractor";

const chatRepo = new ChatRepo()
const chatInteractor = new ChatInteractor(chatRepo)
type user_and_Providers_socketid = {
    [key: string]: string
}
const usersAndProvidersSocketId: user_and_Providers_socketid = {}

export const SocketIntalization = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173'
        }
    })

    io.on("connection", (socket) => {
        const loggedUserId = socket.handshake.query.loggedUserId
        if (loggedUserId) {
            usersAndProvidersSocketId[loggedUserId + ""] = socket.id
            io.emit("setup",{id:loggedUserId})  
        }
    
        socket.on("join-chat", (chatId) => {
            socket.join(chatId) 
           
        })

        socket.on("send-message", (messageDetails) => {
            chatInteractor.addNewMessage(messageDetails.sender, messageDetails.chatId, messageDetails.message).then((response) => {
                io.to(messageDetails.chatId).emit("receivemessage", { response: response.messageCreated })
            })
    
        })

        socket.on("isTyping",(data)=>{
             io.to(data.chatid).emit("typing",data)
        })

        socket.on("oppositeGuysIsInOnlineOrNot",(data)=>{
            if(usersAndProvidersSocketId[data.userId])
            {        
                io.to(usersAndProvidersSocketId[data.emitTo]).emit("isOnline",{online:true})
            }else{
                io.to(usersAndProvidersSocketId[data.emitTo]).emit("isOnline",{online:false}) 
            }
        })

        socket.on("disconnect",()=>{
            const userIdToDisconnect = Object.keys(usersAndProvidersSocketId).find((key)=>{
                return usersAndProvidersSocketId[key] === socket.id;

            })
            if (userIdToDisconnect) {
                delete usersAndProvidersSocketId[userIdToDisconnect]
                if (!usersAndProvidersSocketId[userIdToDisconnect]) {
                    io.emit("userOffline",{online:false,id:userIdToDisconnect}) 
                }
            }   
        })

        socket.on("checkOnlineorNot",({userid,providerid,checker})=>{
            
            
             if(checker==="provider"){
                console.log("usersAndProvidersSocketId[userid]",usersAndProvidersSocketId[userid]);
                if(usersAndProvidersSocketId[userid]){
                    io.to(usersAndProvidersSocketId[providerid]).emit("checkedUserIsOnlineOrNot",{success:true})
                }else{
                    io.to(usersAndProvidersSocketId[providerid]).emit("checkedUserIsOnlineOrNot",{success:false})
                }
             } 

             if (checker==="user") {
                if(usersAndProvidersSocketId[providerid]){
                    io.to(usersAndProvidersSocketId[userid]).emit("checkedUserIsOnlineOrNot",{success:true})
                }else{
                    io.to(usersAndProvidersSocketId[userid]).emit("checkedUserIsOnlineOrNot",{success:false})
                }
             }
        })

        


    })
}