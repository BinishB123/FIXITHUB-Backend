"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIntalization = void 0;
const socket_io_1 = require("socket.io");
const ChatRepo_1 = __importDefault(require("../../interface_adapters/repositories/common/ChatRepo"));
const chatInteractor_1 = __importDefault(require("../../usecases/common/chatInteractor"));
const userProfileInteractor_1 = __importDefault(require("../../usecases/user/userProfileInteractor"));
const userRepo_1 = __importDefault(require("../../interface_adapters/repositories/userRepo"));
const providerRepo_1 = __importDefault(require("../../interface_adapters/repositories/providerRepo"));
const profileInteractor_1 = __importDefault(require("../../usecases/provider/profileInteractor"));
const chatRepo = new ChatRepo_1.default();
const chatInteractor = new chatInteractor_1.default(chatRepo);
const userRepo = new userRepo_1.default();
const userProfileInteractor = new userProfileInteractor_1.default(userRepo);
const providerRepo = new providerRepo_1.default();
const providerProfileInteractor = new profileInteractor_1.default(providerRepo);
const usersAndProvidersSocketId = {};
const SocketIntalization = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.ORGIN,
        },
    });
    io.on("connection", (socket) => {
        const loggedUserId = socket.handshake.query.loggedUserId;
        if (loggedUserId) {
            usersAndProvidersSocketId[loggedUserId + ""] = socket.id;
            io.emit("setup", { id: loggedUserId });
        }
        socket.on("join-chat", (chatId) => {
            socket.join(chatId);
        });
        socket.on("send-message", (messageDetails) => {
            chatInteractor
                .addNewMessage(messageDetails.sender, messageDetails.chatId, messageDetails.message)
                .then((response) => {
                io.to(messageDetails.chatId).emit("receivemessage", {
                    response: response.messageCreated,
                });
                if (messageDetails.sender === "provider") {
                    userProfileInteractor
                        .notificationCountUpdater(messageDetails.recieverId)
                        .then((response) => {
                        if (usersAndProvidersSocketId[messageDetails.recieverId]) {
                            io.to(usersAndProvidersSocketId[messageDetails.recieverId]).emit("notifictaionUpdated", response);
                        }
                    });
                    userProfileInteractor
                        .notificationsGetter(messageDetails.recieverId)
                        .then((response) => {
                        if (usersAndProvidersSocketId[messageDetails.recieverId]) {
                            io.to(usersAndProvidersSocketId[messageDetails.recieverId]).emit("gettNotification", response);
                        }
                    });
                }
                else if (messageDetails.sender === "user") {
                    providerProfileInteractor
                        .notificationCountUpdater(messageDetails.recieverId)
                        .then((response) => {
                        if (usersAndProvidersSocketId[messageDetails.recieverId]) {
                            io.to(usersAndProvidersSocketId[messageDetails.recieverId]).emit("notifictaionUpdated", response);
                        }
                    });
                    providerProfileInteractor
                        .notificationsGetter(messageDetails.recieverId)
                        .then((response) => {
                        if (usersAndProvidersSocketId[messageDetails.recieverId]) {
                            io.to(usersAndProvidersSocketId[messageDetails.recieverId]).emit("gettNotification", response);
                        }
                    });
                }
            });
        });
        socket.on("isTyping", (data) => {
            io.to(data.chatid).emit("typing", data);
        });
        socket.on("oppositeGuysIsInOnlineOrNot", (data) => {
            if (usersAndProvidersSocketId[data.userId]) {
                io.to(usersAndProvidersSocketId[data.emitTo]).emit("isOnline", {
                    online: true,
                });
                if (data.whom === "user") {
                    console.log("data.userId", data.emitTo);
                    userProfileInteractor
                        .notificationCountUpdater(data.emitTo)
                        .then((response) => {
                        if (usersAndProvidersSocketId[data.emitTo]) {
                            io.to(usersAndProvidersSocketId[data.emitTo]).emit("notifictaionUpdated", response);
                        }
                    });
                }
            }
            else {
                io.to(usersAndProvidersSocketId[data.emitTo]).emit("isOnline", {
                    online: false,
                });
            }
        });
        socket.on("disconnect", () => {
            const userIdToDisconnect = Object.keys(usersAndProvidersSocketId).find((key) => {
                return usersAndProvidersSocketId[key] === socket.id;
            });
            if (userIdToDisconnect) {
                delete usersAndProvidersSocketId[userIdToDisconnect];
                if (!usersAndProvidersSocketId[userIdToDisconnect]) {
                    io.emit("userOffline", { online: false, id: userIdToDisconnect });
                }
            }
        });
        socket.on("checkOnlineorNot", ({ userid, providerid, checker }) => {
            if (checker === "provider") {
                console.log("usersAndProvidersSocketId[userid]", usersAndProvidersSocketId[userid]);
                if (usersAndProvidersSocketId[userid]) {
                    io.to(usersAndProvidersSocketId[providerid]).emit("checkedUserIsOnlineOrNot", { success: true });
                }
                else {
                    io.to(usersAndProvidersSocketId[providerid]).emit("checkedUserIsOnlineOrNot", { success: false });
                }
            }
            if (checker === "user") {
                if (usersAndProvidersSocketId[providerid]) {
                    io.to(usersAndProvidersSocketId[userid]).emit("checkedUserIsOnlineOrNot", { success: true });
                }
                else {
                    io.to(usersAndProvidersSocketId[userid]).emit("checkedUserIsOnlineOrNot", { success: false });
                }
            }
        });
        socket.on("getChatidForCreatingRoom", ({ userid, providerid, getter, whomTocall, callerData }) => {
            chatInteractor.getChatid(providerid, userid).then((response) => {
                socket.join(response.id + "");
                io.to(usersAndProvidersSocketId[whomTocall]).emit("incomingcall", {
                    success: true,
                    getter: getter,
                    chatid: response.id,
                    callerData: callerData,
                });
            });
        });
        socket.on("Accepted", (data) => {
            socket.join(data.chatid);
            io.to(usersAndProvidersSocketId[data.getter]).emit("callaccepted", data);
        });
        socket.on("sendOffer", ({ receiver, offer, senderid, callerData }) => {
            io.to(usersAndProvidersSocketId[receiver]).emit("sendOfferToReceiver", {
                offer,
                senderid,
                callerData,
            });
        });
        socket.on("sendCandidate", ({ event, recieverid }) => {
            io.to(usersAndProvidersSocketId[recieverid]).emit("recieveCandidate", {
                event,
            });
        });
        socket.on("answer", ({ to, answer }) => {
            io.to(usersAndProvidersSocketId[to]).emit("recieveAnswer", {
                answer: answer,
            });
        });
        socket.on("getcalleData", ({ id, calle, calleid }) => {
            chatInteractor.getCalleData(calleid, calle).then((response) => {
                io.to(usersAndProvidersSocketId[id]).emit("recieveCalleData", response);
            });
        });
        socket.on("callRejected", ({ callerid }) => {
            io.to(usersAndProvidersSocketId[callerid]).emit("rejected");
        });
        socket.on("updateMessageseen", async ({ messageId }) => {
            await chatInteractor.liveMessageSeen(messageId);
        });
    });
};
exports.SocketIntalization = SocketIntalization;
