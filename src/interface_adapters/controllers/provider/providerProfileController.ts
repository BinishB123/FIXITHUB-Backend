import { NextFunction, Request, Response } from "express";
import IProfileInteractor from "../../../entities/provider/IprofileInteractor";
import HttpStatus from "../../../entities/rules/statusCode";
import { IUploadToCloudinary } from "../../../entities/services/Iclodinary";
import CustomError from "../../../framework/services/errorInstance";
import { IChatInteractor } from "../../../entities/common/IChatInteractor";

class ProviderProfileController {
  constructor(
    private readonly providerProfileInteractor: IProfileInteractor,
    private readonly cloudinary: IUploadToCloudinary,
    private readonly chatInteractor :IChatInteractor
  ) {}
  async getDataToProfile(req: Request, res: Response) {
    try {
      const id: string | undefined = req.query.id + "";

      if (!id) 
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "provided id not passed" });
      const response =
        await this.providerProfileInteractor.getDataToProfile(id);

      if (!response.success) {
        if (response.message === "500") {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error" });
        }
        return res
          .status(HttpStatus.Unprocessable_Entity)
          .json({ message: "something went wrong" });
      }
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async editAbout(req: Request, res: Response) {
    try {
      const { id, about } = req.body.data;

      const response = await this.providerProfileInteractor.editabout({
        id,
        about,
      });
      if (!response.success) {
        return response.message === "500"
          ? res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
          : res.status(HttpStatus.Unprocessable_Entity).json(response);
      }
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error " });
    }
  }

  async addLogo(req: Request, res: Response) {
    try {
        console.log(req.body );
         
      const { id } = req.body;
      const image = req.file?.buffer;

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
          const response = await this.providerProfileInteractor.addImage(data);
          if (response.success) {
            return res.status(HttpStatus.OK).json({ url: response.url });
          }
        }
      }
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "somethingw went wrong" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "internal server error" });
    }
  }

  async updateProfile(req:Request,res:Response){
    try {
      const { id,whichisTotChange,newOne} = req.body
      const data = {id,whichisTotChange,newOne}
      const response = await this.providerProfileInteractor.updateProfiledatas(data)
      if (!response.success) {
         if (response.message==="500") {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("internal server error")
         }else{
          return res.status(HttpStatus.Unprocessable_Entity).json("something went wrong")
         }
      }
      return res.status(HttpStatus.OK).json(response)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"internal server"})
    }
  }
  async getAllBrands(req:Request,res:Response){
    try {
      const id = req.query.id+"" 
      const response = await this.providerProfileInteractor.getAllBrand(id)
      if (!response.success) {
        if (response.message==="500") {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed internal server error"})
        }
        return res.status(HttpStatus.Unprocessable_Entity).json({message:"failed to Fetch Data"})
      }
      return res.status(HttpStatus.OK).json(response)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed internal server error"})
    }
  }

  async changePassword(req:Request,res:Response,next:NextFunction){
    try {
      const {id,currentpassowrd,newpassowrd} = req.body
      if (!id||!currentpassowrd||!newpassowrd) {
        return res.status(HttpStatus.Unprocessable_Entity).json({message:"Data missing something went wrong"})
      }
      const response = await this.providerProfileInteractor.changepassword({id,currentpassowrd,newpassowrd})
     
      return res.status(HttpStatus.OK).json({message:"password changed"})
    } catch (error) {
      next(error)
     }
  }
  
  async updateLogo(req:Request,res:Response,next:NextFunction){
    try {
      
       
             
        const {id,url} = req.body
        const image = req.file?.buffer;
       
        
        
        if(!id||!url||!image){
          throw new CustomError("Data are Not Provided",HttpStatus.Unprocessable_Entity)
        }
        const deleted = await this.cloudinary.deleteFromCloudinary(url,"FixitHub")
         
        if (!deleted) {
          throw new CustomError("Something Went Wrong",HttpStatus.Unprocessable_Entity)

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
            const response = await this.providerProfileInteractor.updateLogo(data.url,data.id);
            if (response.success) {
              return res.status(HttpStatus.OK).json({ url: response.url });
            }
          }
        } 
    } catch (error) {
      next(error)
    }
  }

  async getChatId(req:Request,res:Response,next:NextFunction){
    
     console.log("vannu");
     
    try {
      const {providerId,userId} = req.params
      console.log(providerId,userId);
      
      const response  = await this.chatInteractor.getChatid(providerId,userId)
      console.log("ress",response);
      
      return res.status(HttpStatus.OK).json(response)
    } catch (error:any) {
      console.log("56789",error.message);
      
      next(error)
    }
  }

  async getOneToneChat(req:Request,res:Response,next:NextFunction){
    try {
        const {chatid} = req.params
        const response = await this.chatInteractor.getChatOfOneToOne(chatid)
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
  

}

export default ProviderProfileController;
