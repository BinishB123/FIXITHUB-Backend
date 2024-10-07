import { Request, Response } from "express";
import { IAdminInteractor } from "../../../entities/admin/IadminUserInteractor";



class AdminUserController {
    constructor(private readonly adminUserInteractor: IAdminInteractor) { }

    async getUser(req: Request, res: Response) {    
        const response = await this.adminUserInteractor.getUserData()
        if (!response.success) {
            return res.status(503)
        }
        return res.status(200).json({ success: response.success, users: response.users, active: response.active, blocked: response.blocked })
    }
    async userBlockAndUnblock(req:Request,res:Response){
        const {id,state} = req.body
        const response = await this.adminUserInteractor.userBlockAndUnblock(id,state)
        return res.status(200).json({success:true,message:"updated"})
    }
}


export default AdminUserController