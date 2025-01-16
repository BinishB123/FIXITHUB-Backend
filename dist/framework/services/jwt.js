"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtServices {
    constructor(jwtAccessKey, RefreshKey) {
        this.jwtAccessKey = jwtAccessKey;
        this.RefreshKey = RefreshKey;
    }
    generateToken(payload, options) {
        return jsonwebtoken_1.default.sign(payload, this.jwtAccessKey, options);
    }
    generateRefreshToken(payload, options) {
        return jsonwebtoken_1.default.sign(payload, this.RefreshKey, options);
    }
    verifyjwt(refreshToken) {
        try {
            const user = jsonwebtoken_1.default.verify(refreshToken, this.RefreshKey);
            const newAccessToken = jsonwebtoken_1.default.sign({ username: user.username }, this.jwtAccessKey, { expiresIn: "15m" });
            return { success: true, newAccessToken };
        }
        catch (err) {
            return { success: false, error: "Invalid refresh token." };
        }
    }
}
exports.default = JwtServices;
