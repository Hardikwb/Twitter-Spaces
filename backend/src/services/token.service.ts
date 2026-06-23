import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import config from "../config/config.js";
import type { ITokenResponse } from "../controllers/auth.controller.js";
import userservice from "./user.services.js";
import userModel from "../models/user.models.js";

class TokenService {
  generateTokens(payload: object) {
    const accessToken = jwt.sign(payload, config.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET!, {
      expiresIn: "2m",
    });
    return { accessToken, refreshToken };
  }

  // async verifyAccessToken({accessToken}:{accessToken:string}){
  async verifyAccessToken(accessToken: string) {
    //    const userData:ITokenResponse = jwt.verify(accessToken,config.ACCESS_TOKEN_SECRET!)
    const userData = jwt.verify(
      accessToken,
      config.ACCESS_TOKEN_SECRET!,
    ) as ITokenResponse;
    return userData;
  }

  async verifyRefreshToken(refreshToken: string) {
    const userData = jwt.verify(
      refreshToken,
      config.REFRESH_TOKEN_SECRET!,
    ) as ITokenResponse;
    return userData;
  }

  async findRefreshToken(userId: string, refreshToken: string) {
    const user = await userservice.findUser({
      _id: userId,
      refreshToken: refreshToken,
    });
    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return await userModel.updateOne(
      { _id: userId },
      { refreshToken: refreshToken },
    );
  }
}

const tokenService = new TokenService();
export default tokenService;
