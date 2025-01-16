"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminAuthController {
    constructor(AdminAuthInteractor) {
        this.AdminAuthInteractor = AdminAuthInteractor;
    }
    //this function is for admin
    async signIn(req, res) {
        try {
            const { email, password } = req.body;
            const response = await this.AdminAuthInteractor.signIn(email, password);
            if (!response.success) {
                if (response.message === "invalid password or emailId") {
                    return res.status(401).json({ success: false });
                }
                if (response.message === "something went wrong") {
                    return res.status(500).json({ success: false });
                }
            }
            res.cookie('adminRefreshToken', response.refreshToken, {
                httpOnly: true,
                sameSite: "none",
                path: '/',
                maxAge: 24 * 60 * 60 * 1000,
                secure: true
            });
            res.cookie('adminAccessToken', response.accessToken, {
                httpOnly: true,
                sameSite: "none",
                maxAge: 60 * 60 * 1000
            });
            return res.status(200).json({ success: true });
        }
        catch (error) {
            return res.status(500).json({ success: false });
        }
    }
    async logout(req, res) {
        res.clearCookie('adminRefreshToken', {
            httpOnly: true,
            sameSite: true,
            path: '/'
        });
        res.clearCookie('adminAccessToken', {
            httpOnly: true,
            sameSite: true,
            path: '/'
        });
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
    async checker(req, res) {
        return res.status(200).json({ success: true });
    }
}
exports.default = AdminAuthController;
