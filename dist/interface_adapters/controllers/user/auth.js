"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
class AuthController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    async sendotpController(req, res) {
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
        }
        catch (error) {
            res
                .status(500)
                .json({ message: "Failed to send OTP", error: error.message });
        }
    }
    async verifyandSignup(req, res) {
        try {
            const { userData, finalotp } = req.body;
            if (!userData || !finalotp) {
                return res
                    .status(400)
                    .json({ success: false, message: "Missing user data or OTP." });
            }
            const response = await this.interactor.verifyAndSignup(userData, finalotp);
            // If OTP is verified and signup is successful
            if (response.success) {
                res.cookie("userRefreshToken", response.refreshToken, {
                    httpOnly: true,
                    sameSite: true,
                    secure: true,
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.cookie("userAccessToken", response.acessToken, {
                    httpOnly: true,
                    sameSite: true,
                    maxAge: 30 * 60 * 1000,
                    secure: true
                });
                return res
                    .status(200)
                    .json({
                    user: response.user,
                    success: true,
                    message: response.message,
                });
            }
            else {
                // If OTP verification or signup failed
                return res
                    .status(400)
                    .json({ success: false, message: response.message });
            }
        }
        catch (error) {
            return res
                .status(500)
                .json({
                message: "Failed to signup due to server error",
                success: false,
            });
        }
    }
    async logot(req, res) {
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
    async signIn(req, res) {
        console.log(req.body);
        const { SignInData } = req.body;
        const response = await this.interactor.signin(SignInData);
        if (!response.success) {
            return res
                .status(400)
                .json({ success: false, message: response.message });
        }
        else {
            res.cookie("userRefreshToken", response.refreshToken, {
                httpOnly: true,
                sameSite: "none",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: true
            });
            res.cookie("userAccessToken", response.accesToken, {
                httpOnly: true,
                sameSite: "none",
                maxAge: 60 * 60 * 1000,
                secure: true
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
    async checker(req, res, next) {
        try {
            const id = req.query.id + "";
            const response = await this.interactor.checker(id);
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    async getBrands(req, res, next) {
        try {
            const response = await this.interactor.getBrands();
            return res.status(statusCode_1.default.OK).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = AuthController;
