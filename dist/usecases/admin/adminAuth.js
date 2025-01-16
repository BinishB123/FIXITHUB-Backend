"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminAuthInteractor {
    constructor(adminRepo, jwtservice) {
        this.adminRepo = adminRepo;
        this.jwtservice = jwtservice;
    }
    async signIn(email, password) {
        try {
            const response = await this.adminRepo.adminSignIn(email, password);
            if (!response.success) {
                return { success: false, message: response.message };
            }
            const accessToken = await this.jwtservice.generateToken({ id: response.admin?.id, email: response.admin?.email, role: "admin" }, { expiresIn: "1h" });
            const refreshToken = await this.jwtservice.generateRefreshToken({ id: response.admin?.id, email: response.admin?.email, role: "admin" }, { expiresIn: "1d" });
            return {
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken,
            };
        }
        catch (error) {
            return { success: false, message: "something went wrong" };
        }
    }
}
exports.default = AdminAuthInteractor;
