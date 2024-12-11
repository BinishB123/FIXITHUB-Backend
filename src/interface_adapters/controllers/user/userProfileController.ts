import { NextFunction, Request, Response } from "express";
import IUserProfileInteractor from "../../../entities/user/IuserProfileInteractor";
import HttpStatus from "../../../entities/rules/statusCode";
import CustomError from "../../../framework/services/errorInstance";
import { IUploadToCloudinary } from "../../../entities/services/Iclodinary";
import { IChatInteractor } from "../../../entities/common/IChatInteractor";


class UserProfileController{
    constructor(private readonly userInteractor : IUserProfileInteractor , private readonly cloudinary:IUploadToCloudinary ,private readonly chatInteractor:IChatInteractor){}

    async updateData(req:Request,res:Response,next:NextFunction){
        try {
             const id = req.params.id+""
             const { newData, whichIstoChange} = req.body
             if(!id||!newData||!whichIstoChange){
              return res.status(HttpStatus.Unprocessable_Entity).json({message:"Something went Wrong Try agin"})
             }
             const data = {
                id:id,
                newData: whichIstoChange==="name"? newData:parseInt(newData),
                whichToChange:whichIstoChange
             }
            const response = await this.userInteractor.userUpdateData(data)
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    async addOrChangePhoto(req:Request,res:Response,next:NextFunction){
        try {
            
            const {id,url} = req.body
            const image = req.file?.buffer;
            
            if (!id||!image||id.trim()==="") {
                throw new CustomError("Cannot Update",HttpStatus.Unprocessable_Entity)
            }
            if(url){
                const deleteRes = await this.cloudinary.deleteFromCloudinary(url,"FixitHub")
                if (!deleteRes.success) {
                    throw new CustomError("Updation Failed",HttpStatus.BAD_REQUEST)
                }  
             } 
             if (image instanceof Buffer) {
                const cloudinaryresponse = await this.cloudinary.uploadToCloudinary(
                  image,
                  "FixitHub",
                  "FixithubImages"
                ); 
                if (cloudinaryresponse.success) {
                  const data = {
                    id: id, 
                    url: cloudinaryresponse.url ? cloudinaryresponse.url : "",
                  };
                  const response = await this.userInteractor.addOrChangePhoto(data);
                  if (response.success) {
                    return res.status(HttpStatus.OK).json({ url: response.url });
                  }
                }
              } 

            
        } catch (error) {
            next(error)
        }
    }
    
    async getChatOfOneToOne(req:Request,res:Response,next:NextFunction){
      try {
        const {chatId} = req.params
        const response  = await this.chatInteractor.getChatOfOneToOne(chatId)
        return res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
    }
  
    async fetchChat(req:Request,res:Response,next:NextFunction){
      try {
          const {whom,id} = req.params
          const response = await this.chatInteractor.fetchChats(whom,id)
          return res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
    }
  
    async addMessage(req:Request,res:Response,next:NextFunction){
      try {
          const {sender,chatId,message} = req.body
          console.log(chatId);
          
          const response = await this.chatInteractor.addNewMessage(sender,chatId,message)
          return res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
    }

    async getChatId(req:Request,res:Response,next:NextFunction){
      try {
        const {providerId, userId} = req.params
        console.log("providerId, userId in controller",providerId, userId);
        
        const response = await this.chatInteractor.getChatid(providerId,userId)
        return res.status(200).json(response)
        
      } catch (error) {
        next(error)
      }
    }


}

export default UserProfileController