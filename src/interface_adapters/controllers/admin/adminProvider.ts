import { Imailer } from "../../../entities/services/mailer";
import { IAdminProviderInteractor } from "../../../entities/admin/IadminProvider";
import { NextFunction, Request, Response } from "express";
import HttpStatus from "../../../entities/rules/statusCode";



class AdminProvideController {
    constructor(private readonly adminProviderInteractor:IAdminProviderInteractor,private readonly mailer:Imailer){}
    async getPendingProviders(req:Request,res:Response){
            try {
                const response = await this.adminProviderInteractor.getPendingProviders()
                if(!response.success){
                    return res.status(500).json({success:response.success})
                }
                return res.status(200).json({success:response.success,providers:response.providers})
                
            } catch (error) {
                return  res.status(500).json({success:false})
            }
    }

    async getProviders(req:Request,res:Response){
        try {
            const response = await this.adminProviderInteractor.getProviders()
            if(!response.success){
                return res.status(500).json({success:response.success})
            }
            return res.status(200).json({success:response.success,providers:response.providers})
            
        } catch (error) {
            return  res.status(500).json({success:false})
        }

    }
    async adminAcceptOrReject(req:Request,res:Response){
        const {id,state,reason,email,accept} = req.body 
        if (accept===false) {
            if(!id||!reason||!email){
                return res.status(HttpStatus.Unprocessable_Entity).json({message:"failed to Reject"})
            }
        }
        const response = await this.adminProviderInteractor.adminAcceptAndReject(id,state)
         if (response.success) {
            if (accept===false) {
                const data = {
                    email:email,subject:"Rejected From FixitHub",text:reason
                }
                 const response = await this.mailer.sendMailToUsers(data.email,data.subject,data.text)
                 
                 if (!response.success) {
                    return res.status(HttpStatus.BAD_REQUEST).json({message:"Email Sending Failed"})
                 }
            }
        return res.status(200).json({success:true,message:"updated"})
       }
       return res.status(400).json({succes:false})
    }

    async providerBlockOrUnblock(req:Request,res:Response){
        const {id,state} = req.body
        const response = await this.adminProviderInteractor.providerBlockOrUnblock(id,state)
       if (response.success) {
        return res.status(200).json({success:true,message:"updated"})
       }
       return res.status(400).json({succes:false})
    }


    async getMonthlyRevenue(req: Request, res: Response, next: NextFunction) {
        try {
          const { id } = req.params
         
          
          const response = await this.adminProviderInteractor.getMonthlyRevenue(id)
          return res.status(HttpStatus.OK).json(response)
        } catch (error) {
          next(error)
        }
      }
    
      async getTopBookedService(req: Request, res: Response, next: NextFunction) {
        try {
          const { id } = req.params
          const response = await this.adminProviderInteractor.TopServicesBooked(id)
          return res.status(HttpStatus.OK).json(response)
        } catch (error) {
          next(error)
        }
      }

}

export default AdminProvideController