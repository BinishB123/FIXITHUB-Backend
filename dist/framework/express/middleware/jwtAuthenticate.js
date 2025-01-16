"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = __importDefault(require("../../../entities/rules/statusCode"));
const userSchema_1 = __importDefault(require("../../../framework/mongoose/userSchema"));
const providerSchema_1 = __importDefault(require("../../../framework/mongoose/providerSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorInstance_1 = __importDefault(require("../../../framework/services/errorInstance"));
const refreshAccessToken = async (refreshToken, type) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESHTOKENKEY);
        if (!decoded) {
            return 401;
        }
        if (type !== "admin") {
            const isAllowed = await checkBlockOrNot(decoded.id, type);
            if (!isAllowed) {
                return 401;
            }
        }
        if (decoded.role !== type) {
            return 401;
        }
        return jsonwebtoken_1.default.sign({ id: decoded.id, email: decoded.email, role: decoded.role }, process.env.ACCESSTOKENKEY, { expiresIn: "1h" });
    }
    catch (err) {
        return 401;
    }
};
const verification = (type) => {
    return async (req, res, next) => {
        try {
            console.log(req.cookies[`${type}AccessToken`]);
            const accessToken = req.cookies?.[`${type}AccessToken`];
            if (!accessToken) {
                const refreshToken = req.cookies?.[`${type}RefreshToken`];
                if (refreshToken) {
                    const newAccessToken = await refreshAccessToken(refreshToken, type);
                    if (newAccessToken === 401) {
                        throw new errorInstance_1.default("Access expired", statusCode_1.default.FORBIDDEN);
                    }
                    if (newAccessToken) {
                        res.cookie(`${type}AccessToken`, newAccessToken, {
                            httpOnly: true,
                            sameSite: "strict",
                            path: "/",
                            maxAge: 60 * 60 * 1000,
                        });
                        req.cookies[`${type}AccessToken`] = newAccessToken;
                        return next();
                    }
                }
                else {
                    throw new errorInstance_1.default("Access expired", statusCode_1.default.FORBIDDEN);
                }
            }
            const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESSTOKENKEY);
            // const currentTime = Math.floor(Date.now()/1000)
            // console.log(currentTime<decoded.exp)
            if (type !== decoded.role) {
                throw new errorInstance_1.default("Access Denied", statusCode_1.default.UNAUTHORIZED);
            }
            if (type !== "admin") {
                const isAllowed = await checkBlockOrNot(decoded.id, type);
                if (!isAllowed) {
                    throw new errorInstance_1.default("You are blocked by admin", statusCode_1.default.UNAUTHORIZED);
                }
            }
            next();
        }
        catch (err) {
            res.clearCookie(`${type}AccessToken`, {
                httpOnly: true,
                sameSite: true,
                path: "/",
            });
            res.clearCookie(`${type}RefreshToken`, {
                httpOnly: true,
                sameSite: true,
                path: "/",
            });
            next(err);
        }
    };
};
const checkBlockOrNot = async (id, type) => {
    try {
        const user = type === "user"
            ? await userSchema_1.default.findById(new mongoose_1.default.Types.ObjectId(id))
            : await providerSchema_1.default.findById(new mongoose_1.default.Types.ObjectId(id));
        if (!user || user.blocked) {
            return false;
        }
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.default = verification;
