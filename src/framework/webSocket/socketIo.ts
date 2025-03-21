import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import ChatRepo from "../../interface_adapters/repositories/common/ChatRepo";
import ChatInteractor from "../../usecases/common/chatInteractor";
import UserProfileInteractor from "../../usecases/user/userProfileInteractor";
import UserRepository from "../../interface_adapters/repositories/userRepo";
import ProviderRepository from "../../interface_adapters/repositories/providerRepo";
import ProviderProfileInteractor from "../../usecases/provider/profileInteractor";

const chatRepo = new ChatRepo();
const chatInteractor = new ChatInteractor(chatRepo);
const userRepo = new UserRepository();
const userProfileInteractor = new UserProfileInteractor(userRepo);
const providerRepo = new ProviderRepository();
const providerProfileInteractor = new ProviderProfileInteractor(providerRepo);
type user_and_Providers_socketid = {
  [key: string]: string;
};
const usersAndProvidersSocketId: user_and_Providers_socketid = {};
console.log(usersAndProvidersSocketId);

export const SocketIntalization = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORGIN,
    },
  });

  io.on("connection", (socket) => {
    const loggedUserId = socket.handshake.query.loggedUserId;
    if (loggedUserId) {
      usersAndProvidersSocketId[loggedUserId + ""] = socket.id;
      console.log("online users =",usersAndProvidersSocketId);
      
      io.emit("setup", { id: loggedUserId });
    }

    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("send-message", (messageDetails) => {
      console.log(messageDetails);
      console.log(usersAndProvidersSocketId);
      
      
      console.log("send-m",);
      
      chatInteractor
        .addNewMessage(
          messageDetails.sender,
          messageDetails.chatId,
          messageDetails.message
        )
        .then((response) => {
          io.to(messageDetails.chatId).emit("receivemessage", {
            response: response.messageCreated,
          });
          if (messageDetails.sender === "provider") {
            userProfileInteractor
              .notificationCountUpdater(messageDetails.recieverId)
              .then((response) => {
                if (usersAndProvidersSocketId[messageDetails.recieverId]) {
                  io.to(
                    usersAndProvidersSocketId[messageDetails.recieverId]
                  ).emit("notifictaionUpdated", response);
                }
              });
            userProfileInteractor
              .notificationsGetter(messageDetails.recieverId)
              .then((response) => {
                if (usersAndProvidersSocketId[messageDetails.recieverId]) {
                  io.to(
                    usersAndProvidersSocketId[messageDetails.recieverId]
                  ).emit("gettNotification", response);
                }
              });
          } else if (messageDetails.sender === "user") {
            providerProfileInteractor
              .notificationCountUpdater(messageDetails.recieverId)
              .then((response) => {
                if (usersAndProvidersSocketId[messageDetails.recieverId]) {
                  io.to(
                    usersAndProvidersSocketId[messageDetails.recieverId]
                  ).emit("notifictaionUpdated", response);
                }
              });
            providerProfileInteractor
              .notificationsGetter(messageDetails.recieverId)
              .then((response) => {
                if (usersAndProvidersSocketId[messageDetails.recieverId]) {
                  io.to(
                    usersAndProvidersSocketId[messageDetails.recieverId]
                  ).emit("gettNotification", response);
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
                io.to(usersAndProvidersSocketId[data.emitTo]).emit(
                  "notifictaionUpdated",
                  response
                );
              }
            });
        }
      } else {
        io.to(usersAndProvidersSocketId[data.emitTo]).emit("isOnline", {
          online: false,
        });
      }
    });

    socket.on("disconnect", () => {
      const userIdToDisconnect = Object.keys(usersAndProvidersSocketId).find(
        (key) => {
          return usersAndProvidersSocketId[key] === socket.id;
        }
      );
      if (userIdToDisconnect) {
        delete usersAndProvidersSocketId[userIdToDisconnect];
        if (!usersAndProvidersSocketId[userIdToDisconnect]) {
          io.emit("userOffline", { online: false, id: userIdToDisconnect });
        }
      }
    });

    socket.on("checkOnlineorNot", ({ userid, providerid, checker }) => {
      if (checker === "provider") {
        console.log(
          "usersAndProvidersSocketId[userid]",
          usersAndProvidersSocketId[userid]
        );
        if (usersAndProvidersSocketId[userid]) {
          io.to(usersAndProvidersSocketId[providerid]).emit(
            "checkedUserIsOnlineOrNot",
            { success: true }
          );
        } else {
          io.to(usersAndProvidersSocketId[providerid]).emit(
            "checkedUserIsOnlineOrNot",
            { success: false }
          );
        }
      }

      if (checker === "user") {
        if (usersAndProvidersSocketId[providerid]) {
          io.to(usersAndProvidersSocketId[userid]).emit(
            "checkedUserIsOnlineOrNot",
            { success: true }
          );
        } else {
          io.to(usersAndProvidersSocketId[userid]).emit(
            "checkedUserIsOnlineOrNot",
            { success: false }
          );
        }
      }
    });

    socket.on(
      "getChatidForCreatingRoom",
      ({ userid, providerid, getter, whomTocall, callerData }) => {
        chatInteractor.getChatid(providerid, userid).then((response) => {
          socket.join(response.id + "");
          io.to(usersAndProvidersSocketId[whomTocall]).emit("incomingcall", {
            success: true,
            getter: getter,
            chatid: response.id,
            callerData: callerData,
          });
        });
      }
    );

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
