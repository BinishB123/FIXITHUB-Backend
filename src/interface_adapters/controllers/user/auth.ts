import HttpStatus from "../../../entities/rules/statusCode";
import IuserauthInteractor from "../../../entities/user/iauth";
import { NextFunction, Request, Response } from "express";

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
                return res
                    .status(200)
                    .json({ success: true, message: response.message });
            }

            return res
                .status(200)
                .json({ success: false, message: response.message });
        } catch (error: any) {
            res
                .status(500)
                .json({ message: "Failed to send OTP", error: error.message });
        }
    }

    async verifyandSignup(req: Request, res: Response) {
        try {
            const { userData, finalotp } = req.body;
            if (!userData || !finalotp) {
                return res
                    .status(400)
                    .json({ success: false, message: "Missing user data or OTP." });
            }
            const response = await this.interactor.verifyAndSignup(
                userData,
                finalotp
            );
            // If OTP is verified and signup is successful
            if (response.success) {
                res.cookie("userRefreshToken", response.refreshToken, {
                    httpOnly: true,
                    sameSite: true,
                    secure:true,
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60 * 1000, 
                });

                res.cookie("userAccessToken", response.acessToken, {
                    httpOnly: true,
                    sameSite: true,
                    maxAge: 30 * 60 * 1000,
                    secure:true
                });
                return res
                    .status(200)
                    .json({
                        user: response.user,
                        success: true,
                        message: response.message,
                    });
            } else {
                // If OTP verification or signup failed
                return res
                    .status(400)
                    .json({ success: false, message: response.message });
            }
        } catch (error: any) {
            return res
                .status(500)
                .json({
                    message: "Failed to signup due to server error",
                    success: false,
                });
        }
    }

    async logot(req: Request, res: Response) {
        res.clearCookie("userRefreshToken", {
            httpOnly: true,
            sameSite: true,
            path: "/",
        });
        res.clearCookie("userAccessToken", {
            httpOnly: true,
            sameSite: true,
            path: "/",
        });
        return res
            .status(200)
            .json({ success: true, message: "Logged out successfully" });
    }

    async signIn(req: Request, res: Response) {
        console.log(req.body);
        
        const { SignInData } = req.body;
        const response = await this.interactor.signin(SignInData);

        if (!response.success) {
            return res
                .status(400)
                .json({ success: false, message: response.message });
        } else {
            res.cookie("userRefreshToken", response.refreshToken, {
                httpOnly: true,
                sameSite: "none",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure:true
            });

            res.cookie("userAccessToken", response.accesToken, {
                httpOnly: true,
                sameSite: "none",
                maxAge: 60 * 60 * 1000,
                secure:true
            });
            return res
                .status(200)
                .json({
                    user: response.user,
                    success: response.success,
                    message: "LOGGED IN",
                });
        }
    }

    async checker(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.query.id + "";
            const response = await this.interactor.checker(id);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getBrands(req:Request,res:Response,next:NextFunction){
        try {
            const response = await this.interactor.getBrands()
            return res.status(HttpStatus.OK).json(response)
        } catch (error) {
           next(error)  
        }
    }
}

export default AuthController;
