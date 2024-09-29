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

    async registerProvider(req: Request, res: Response) {
        const registerdata = req.body

        if (!registerdata) {
            res.status(400).json({ created: false, message: "something went wrong" })
            return
        }

        const interactorResponse = await this.providerAuthInteractor.registerProvider(registerdata)
        if (!interactorResponse.created && interactorResponse.message === "server down") {
            res.status(500).json({ created: false, message: "something went wrong" })
        } else if (!interactorResponse.created && interactorResponse.message === "registration failed") {
            res.status(409).json({ message: "registration failed try again" })
        }
        res.cookie('providerRefreshToken', interactorResponse.refreshToken, {
            httpOnly: true,
            sameSite: true,
            path: '/',
            maxAge: 15 * 60 * 1000
        })

        res.cookie('providerAccessToken', interactorResponse.accessToken, {
            httpOnly: true,
            sameSite: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({ created: true, message: "Registration success", provider: interactorResponse.provider })
    }

}




export default ProviderAuthController