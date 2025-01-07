import jwt from "jsonwebtoken";
import { Ijwtservices } from "../../entities/services/Ijwt";

class JwtServices implements Ijwtservices {
    constructor(
        private readonly jwtAccessKey: string,
        private readonly RefreshKey: string
    ) { }
    generateToken(payload: Object, options?: jwt.SignOptions): string {
        return jwt.sign(payload, this.jwtAccessKey, options);
    }
    generateRefreshToken(payload: Object, options?: jwt.SignOptions): string {
        return jwt.sign(payload, this.RefreshKey, options);
    }

    verifyjwt(refreshToken: string): {
        success: boolean;
        newAccessToken?: string;
        error?: string;
    } {
        try {
            const user = jwt.verify(refreshToken, this.RefreshKey) as jwt.JwtPayload;
            const newAccessToken = jwt.sign(
                { username: user.username },
                this.jwtAccessKey,
                { expiresIn: "15m" }
            );

            return { success: true, newAccessToken };
        } catch (err) {
            return { success: false, error: "Invalid refresh token." };
        }
    }
}

export default JwtServices;
