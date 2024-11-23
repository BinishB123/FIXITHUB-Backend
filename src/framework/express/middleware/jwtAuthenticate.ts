import HttpStatus from "../../../entities/rules/statusCode";
import { Request, Response, NextFunction } from "express";
import userModel from "../../../framework/mongoose/userSchema";
import providerModel from "../../../framework/mongoose/providerSchema";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import CustomError from "../../../framework/services/errorInstance";

type DecodedToken = {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

const refreshAccessToken = async (
  refreshToken: string,
  type: string
): Promise<string | null | number> => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESHTOKENKEY as string
    ) as DecodedToken;

    if (type !== "admin") {
      const isAllowed = await checkBlockOrNot(decoded.id, type);
      if (!isAllowed) {
        return 401;
      }
    }

    if (decoded.role !== type) {
      return 401;
    }

    return jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.ACCESSTOKENKEY as string,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return 401;
  }
};

const verification = (type: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies?.[`${type}AccessToken`];

      if (!accessToken) {
        const refreshToken = req.cookies?.[`${type}RefreshToken`];
        if (refreshToken) {
          const newAccessToken = await refreshAccessToken(refreshToken, type);
          if (newAccessToken === 401) {
            throw new CustomError("Access expired", HttpStatus.FORBIDDEN);
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
        } else {

          throw new CustomError("Access expired", HttpStatus.FORBIDDEN);
        }
      }
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESSTOKENKEY as string
      ) as DecodedToken;
       
      // const currentTime = Math.floor(Date.now()/1000)
      // console.log(currentTime<decoded.exp)
     
     
      if (type !== "admin") {
        const isAllowed = await checkBlockOrNot(decoded.id, type);
        if (!isAllowed) {
          throw new CustomError("You are blocked by admin", HttpStatus.UNAUTHORIZED);
        }
      }

      next();
    } catch (err) {
      res.clearCookie(`${type}AccessToken`, {
        httpOnly: true,
        sameSite: true,
        path: '/'
      })
      res.clearCookie(`${type}RefreshToken`, {
        httpOnly: true,
        sameSite: true,
        path: '/'
      })
      next(err);
    }
  };
};

const checkBlockOrNot = async (id: string, type: string): Promise<boolean> => {
  try {
    const user =
      type === "user"
        ? await userModel.findById(new mongoose.Types.ObjectId(id))
        : await providerModel.findById(new mongoose.Types.ObjectId(id));

    if (!user || user.blocked) {
      return false
    }
    return true;
  } catch (error) {
    return false;
  }
};

export default verification;
