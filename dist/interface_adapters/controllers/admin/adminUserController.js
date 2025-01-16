"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminUserController {
    constructor(adminUserInteractor) {
        this.adminUserInteractor = adminUserInteractor;
    }
    async getUser(req, res) {
        const response = await this.adminUserInteractor.getUserData();
        if (!response.success) {
            return res.status(503);
        }
        return res.status(200).json({
            success: response.success,
            users: response.users,
            active: response.active,
            blocked: response.blocked,
        });
    }
    async userBlockAndUnblock(req, res) {
        const { id, state } = req.body;
        const response = await this.adminUserInteractor.userBlockAndUnblock(id, state);
        return res.status(200).json({ success: true, message: "updated" });
    }
}
exports.default = AdminUserController;
