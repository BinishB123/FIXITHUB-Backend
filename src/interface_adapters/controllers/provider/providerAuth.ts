import HttpStatus from "../../../entities/rules/statusCode";
import IProviderAuthInteractor from "../../../entities/provider/Iauth";
import { Request, Response } from "express";

class ProviderAuthController {
    constructor(
        private readonly providerAuthInteractor: IProviderAuthInteractor
    ) { }
    async sendOtp(req: Request, res: Response) {
        const { email } = req.body;
        if (!email) {
            return res
                .status(400)
                .json({ success: false, message: "please provide Email" });
        }
        const interactorResponse = await this.providerAuthInteractor.sendOtp(email);
        if (!interactorResponse.created) {
            return res
                .status(400)
                .json({ success: false, message: interactorResponse.message });
        }
        return res
            .status(200)
            .json({ success: true, message: interactorResponse.message });
    }

    async verifyOtp(req: Request, res: Response) {
        const { email, otp } = req.body;

        const interactorResponse = await this.providerAuthInteractor.verify(
            email,
            otp
        );
        if (!interactorResponse.success) {
            return res
                .status(400)
                .json({ success: false, message: interactorResponse.message });
        }
        return res
            .status(200)
            .json({ success: true, message: interactorResponse.message });
    }

    async registerProvider(req: Request, res: Response) {
        const registerdata = req.body;

        if (!registerdata) {
            res.status(400).json({ created: false, message: "something went wrong" });
            return;
        }

        const interactorResponse =
            await this.providerAuthInteractor.registerProvider(registerdata);
        if (
            !interactorResponse.created &&
            interactorResponse.message === "server down"
        ) {
            res.status(500).json({ created: false, message: "something went wrong" });
        } else if (
            !interactorResponse.created &&
            interactorResponse.message === "registration failed"
        ) {
            res.status(409).json({ message: "registration failed try again" });
        }

        res
            .status(200)
            .json({
                created: true,
                message: "Registration success",
                provider: interactorResponse.provider,
            });
    }

    async signInProvider(req: Request, res: Response) {
        const signData = req.body.registerData;

        if (!signData) {
            res.status(400).json({ created: false, message: "something went wrong" });
            return;
        }
        const interactorResponse =
            await this.providerAuthInteractor.signInProvider(signData);

        if (interactorResponse.message === "incorrect password") {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "The password you entered is incorrect. Please try again.",
                });
        } else if (
            interactorResponse.message === "registration request not accepted"
        ) {
            return res
                .status(403)
                .json({
                    success: false,
                    message:
                        "Your registration request is still pending approval. Please wait until it is accepted.",
                });
        } else if (
            interactorResponse.message === "provider not exist with this email"
        ) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "No provider account found associated with this email.",
                });
        } else if (interactorResponse.message === "server down") {
            return res
                .status(500)
                .json({
                    success: false,
                    message:
                        "The server is currently unavailable. Please try again later.",
                });
        } else if (interactorResponse.message === "rejected your request") {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Your registration request has been rejected",
                });
        } else if (
            interactorResponse.message ===
            "Access denied. Your account has been blocked. "
        ) {
            return res
                .status(403)
                .json({ success: false, message: "Your account is currently blocked" });
        }

        res.cookie("providerRefreshToken", interactorResponse.refreshToken, {
            httpOnly: true,
            sameSite: "none",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
            secure:true
        });

        res.cookie("providerAccessToken", interactorResponse.accessToken, {
            httpOnly: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000,
            secure:true
        });

        res
            .status(200)
            .json({
                success: true,
                message: "Sign-in successful. Welcome back!",
                provider: interactorResponse.provider,
            });
    }

    async logot(req: Request, res: Response) {
        res.clearCookie("providerRefreshToken", {
            httpOnly: true,
            sameSite: true,
            path: "/",
        });
        res.clearCookie("providerAccessToken", {
            httpOnly: true,
            sameSite: true,
            path: "/",
        });
        return res
            .status(200)
            .json({ success: true, message: "Logged out successfully" });
    }

    async checker(req: Request, res: Response) {
        try {
            return res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "Internal server error" });
        }
    }
}

export default ProviderAuthController;
