import type { Request, Response, NextFunction } from "express";
import { APIError } from "../utils/APIError.js";
import tokenService from "../services/token.service.js";
import type { IUser } from "../dtos/user.dto.js";

interface CustomRequest extends Request {
  user?: any;
  // #TODO: to fix
}

const authMiddleWare = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken) {
      throw new APIError(400, "User not authenticated");
    }
    const userData = await tokenService.verifyAccessToken(accessToken);
    if (!userData) {
      throw new APIError(401, "Invalid token");
    }
    // console.log("UserData", userData);
    req.user = userData;
    next();
  } catch (error) {
    throw new APIError(401, "Invalid token");

    next(error);
  }
};

export default authMiddleWare;
