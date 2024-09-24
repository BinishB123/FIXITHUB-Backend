import IuserauthInteractor from "../../../entities/user/iauth";
import { Request, Response } from 'express';
class AuthController {
    constructor(private readonly interactor: IuserauthInteractor) { }
    async sendotpController(req: Request, res: Response) {
        try {
            const email = req.body?.email;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            const response = await this.interactor.sendotp(email);
            if (response.success) {
              return  res.status(200).json({ success: true, message: response.message });
            }

            return res.status(200).json({ success: false, message: response.message })

        } catch (error: any) {
            res.status(500).json({ message: "Failed to send OTP", error: error.message });
        }
    }
}


export default AuthController