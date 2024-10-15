import HttpStatus from "../../../entities/rules/statusCode";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type DecodedToken = {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

const refreshAccessToken = (
  refreshToken: string,
  type: string
): string | null | number => {
  try {
    const decoded: DecodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESHTOKENKEY as string
    ) as DecodedToken;  console.log(decoded);
  
    if (decoded.role !== type) {
      return 401;
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.ACCESSTOKENKEY as string,
      { expiresIn: "1h" } 
    );

    return newAccessToken;
  } catch (err) {
    console.error("Error verifying refresh token:", err);
    return null;
  }
};

const verification = (type: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.[type + "AccessToken"];

    jwt.verify(
      accessToken,
      process.env.ACCESSTOKENKEY as string,
      (err: any) => {
        if (err) {
          const refreshToken = req.cookies?.[type + "RefreshToken"];

          if (refreshToken) {
            const newAccessToken = refreshAccessToken(refreshToken, type);
            if (newAccessToken === 401) {
              return res
                .status(HttpStatus.UNAUTHORIZED)
                .json({ message: "Unauthorized: Invalid role" });
              res.status(HttpStatus.UNAUTHORIZED).json({});
            }
            if (newAccessToken) {
              // Set the new access token in the cookie
              res.cookie(`${type}AccessToken`, newAccessToken, {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
              });

              // Update the request with the new access token
              req.cookies[type + "AccessToken"] = newAccessToken;

              return next();
            }
          }

          return res
            .status(403)
            .json({
              message: "Access token is expired and refresh token is missing.",
            });
        }

        // Proceed to the next middleware if access token is valid
        next();
      }
    );
  };
};

export default verification;
