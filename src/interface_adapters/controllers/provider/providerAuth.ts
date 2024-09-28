import IProviderAuthInteractor from "../../../entities/provider/Iauth";
import { Request, Response } from "express";




class ProviderAuthController {
    constructor(private readonly providerAuthInteractor: IProviderAuthInteractor) { }
    async sendOtp(req: Request, res: Response) {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ success: false, message: "please provide Email" })
        }
        const interactorResponse = await this.providerAuthInteractor.sendOtp(email)
        if (!interactorResponse.created) {
            return res.status(400).json({ success: false, message: interactorResponse.message })
        }
        return res.status(200).json({ success: true, message: interactorResponse.message })
    }

    async verifyOtp(req: Request, res: Response) {
        const { email, otp } = req.body
    
        const interactorResponse = await this.providerAuthInteractor.verify(email, otp)
        if (!interactorResponse.success) {
            return res.status(400).json({ success: false, message: interactorResponse.message })
        }
        return res.status(200).json({ success: true, message: interactorResponse.message })
    }

}




export default ProviderAuthController