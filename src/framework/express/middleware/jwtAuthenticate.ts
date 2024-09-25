import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const refreshAccessToken = (refreshToken: string): string | null => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKENKEY as string);
        const newAccessToken = jwt.sign(
            { userId: (decoded as any).userId },
            process.env.ACCESSTOKENKEY as string,
            { expiresIn: '15m' }
        );
        return newAccessToken;
    } catch (err) {
        console.log('Error refreshing access token:', err);
        return null;
    }
};

const verification = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken; // Access token from cookies

    if (!accessToken) {
        return res.status(403).json({ message: 'Access token is missing.' });
    }

    jwt.verify(accessToken, process.env.ACCESSTOKENKEY as string, (err: any) => {
        if (err) {
            const refreshToken = req.cookies?.refreshToken; // Refresh token from cookies
            if (refreshToken) {
                const newAccessToken = refreshAccessToken(refreshToken);
                if (newAccessToken) {
                    res.cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                        path: '/',
                        maxAge: 15 * 60 * 1000
                    });

                    // Simulate that the cookie is set
                    req.cookies.accessToken = newAccessToken;

                    return next(); // Proceed to the next middleware/route handler
                }
            }
            return res.status(403).json({ message: 'Access token is expired and refresh token is missing.' });
        }


        next(); // Proceed to the next middleware/route handler
    });
};

export default verification;
