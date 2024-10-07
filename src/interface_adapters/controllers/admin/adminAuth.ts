import IAdminInteractor from "../../../entities/admin/IAuth"
import { Request, Response } from "express"

class AdminAuthController {
    constructor(private readonly AdminAuthInteractor: IAdminInteractor) { }
    //this function is for admin
    async signIn(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const response = await this.AdminAuthInteractor.signIn(email, password)

            if (!response.success) {
                if (response.message === "invalid password or emailId") {
                    return res.status(401).json({ success: false })
                }
                if (response.message === "something went wrong") {
                    return res.status(500).json({ success: false })
                }
            }


            res.cookie('adminRefreshToken', response.refreshToken, {
                httpOnly: true,
                sameSite: true,
                path: '/',
                maxAge: 24 * 60 * 60 * 1000,
                secure: true
            })

            res.cookie('adminAccessToken', response.accessToken, {
                httpOnly: true,
                sameSite: true,
                maxAge: 30 * 60 * 1000
            })
            return res.status(200).json({ success: true })

        } catch (error) {
            return res.status(500).json({ success: false })
        }
    }

    async logout(req: Request, res: Response) {

        res.clearCookie('adminRefreshToken', {
            httpOnly: true,
            sameSite: true,
            path: '/'
        })
        res.clearCookie('adminAccessToken', {
            httpOnly: true,
            sameSite: true,
            path: '/'
        })
        return res.status(200).json({ success: true, message: 'Logged out successfully' })
    }
     
    async checker(req:Request,res:Response){
        return res.status(200).json({success:true})
    }
    
}

export default AdminAuthController