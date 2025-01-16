"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminUserInteractor {
    constructor(adminUserRepo) {
        this.adminUserRepo = adminUserRepo;
    }
    async getUserData() {
        try {
            const response = await this.adminUserRepo.adminGetUserData();
            if (!response.success) {
                return { success: false };
            }
            return {
                success: true,
                users: response.users,
                active: response.active,
                blocked: response.blocked,
            };
        }
        catch (error) {
            return { success: false };
        }
    }
    async userBlockAndUnblock(id, state) {
        try {
            const response = await this.adminUserRepo.adminBlockUnBlockUser(id, state);
            return { success: true, message: "" };
        }
        catch (error) {
            return { success: true };
        }
    }
}
exports.default = AdminUserInteractor;
