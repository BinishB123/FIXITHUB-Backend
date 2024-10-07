import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const refreshAccessToken = (refreshToken: string): string | null => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKENKEY as string);
        console.log("decoded", decoded);

        const newAccessToken = jwt.sign({ userId: (decoded as any).userId },
            process.env.ACCESSTOKENKEY as string,
            { expiresIn: '1hr' }
        );
        return newAccessToken;
    } catch (err) {

        return null;
    }
};

const verification = (type: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies?.[type + "AccessToken"];


        jwt.verify(accessToken, process.env.ACCESSTOKENKEY as string, (err: any) => {
            if (err) {
                const refreshToken = req.cookies?.[type + "RefreshToken"];


                if (refreshToken) {
                    const newAccessToken = refreshAccessToken(refreshToken);
                    if (newAccessToken) {
                        res.cookie(`${type}AccessToken`, newAccessToken, {
                            httpOnly: true,
                            sameSite: 'strict',
                            path: '/',
                            maxAge: 30 * 60 * 1000
                        });

                        req.cookies[type + "AccessToken"] = newAccessToken;


                        return next();
                    }
                }
                return res.status(403).json({ message: 'Access token is expired and refresh token is missing.' });
            }


            next();
        });
    };

}
export default verification;
