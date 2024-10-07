import { IAdminProviderInteractor } from "../../../entities/admin/IadminProvider";
import { Request, Response } from "express";



class AdminProvideController {
    constructor(private readonly adminProviderInteractor:IAdminProviderInteractor){}
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
        const {id,state} = req.body
       
        
        const response = await this.adminProviderInteractor.adminAcceptAndReject(id,state)
       if (response.success) {
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

}

export default AdminProvideController