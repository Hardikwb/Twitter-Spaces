import type { Request, Response } from "express";
import codeService from "../services/code.services.js";
import { APIError } from "../utils/APIError.js";
import { ApiResponse } from "../utils/APIResponse.js";
import hashServices from "../services/hash.services.js";
import sendVerificationEmail from "../email/sendVerificationEmail.js";
import userservice from "../services/user.services.js";
import tokenService from "../services/token.service.js";
import UserDTO from "../dtos/user.dto.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { id } from "zod/locales";
import config from "../config/config.js";

export interface ITokenResponse {
  _id: string;
  iat: number;
  exp: number;
}

class AuthController {
  async sendCode(req: Request, res: Response) {
    const { email }: { email: string } = req.body;
    if (!email) {
      throw new APIError(500, "No email Found");
    }
    const ttl = 1000 * 60 * 10;
    const expiresTime = Date.now() + ttl;
    const code = codeService.generateCode().toString();
    const hash = hashServices.hashData(`${email}.${code}`);
    const data = `${hash}.${expiresTime}`;
    console.log(code);

    // await sendVerificationEmail(email,code)
    return res.json(
      new ApiResponse(200, "Code generated successfully", {
        email: email,
        data: data,
        expires: expiresTime,
      }),
    );
  }

  async verifyCode(req: Request, res: Response) {
    const { email, code, hash }: { email: string; code: string; hash: string } =
      req.body;
    const [hashedData, expireTime] = hash.split(".");
    // const [hashedData,expireTime] = hash.data.split('.')

    if (!email || !code || !hash) {
      throw new APIError(500, "All fields are required");
    }

    if (Date.now() > Number(expireTime)) {
      throw new APIError(400, "Verify Code expired");
    }

    const isValid = codeService.verifyCode(`${email}.${code}`, hashedData!);

    if (!isValid) {
      throw new APIError(500, "Code is not correct");
    }

    let user;

    try {
      user = await userservice.findUser({ email: email });
      if (!user) {
        const newUser = await userservice.createUser({
          email: email,
        });
        const { accessToken, refreshToken } = tokenService.generateTokens({
          _id: newUser?._id,
        });
        newUser.refreshToken = refreshToken;
        newUser.save();

        res.cookie("refreshToken", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: true,
          secure: config.NODE_ENV === "production",
        });
        res.cookie("accessToken", accessToken, {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
          secure: config.NODE_ENV === "production",
        });

        const userDto = new UserDTO(newUser);
        // console.log("userDTO",userDto)
        // console.log("newUser",newUser)
        // return res.json({"accessToken":accessToken,"refreshToken":refreshToken,user:userDto})
        return res.json(
          new ApiResponse(200, "User verified successfully", {
            user: userDto,
            auth: true,
          }),
        );
      }
    } catch (error) {
      console.log(`VerifyCode::Error::${error}`);
    }
  }

  async activate(req: Request, res: Response) {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const { email, username } = req.body;
    const user = await userservice.findUser({ email: email });
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    if (!user) throw new APIError(401, "No user with email exists");
    if (!cloudinaryResponse?.url) {
      throw new APIError(500, "Unable to uplaod file on cloudinary");
    }
    user.username = username;
    user.publicId = cloudinaryResponse.public_id;
    user.avatar = cloudinaryResponse.secure_url;
    user.activated = true;
    await user.save();
    return res.json(
      new ApiResponse(200, "updated user successfully", {
        user: new UserDTO(user),
        avatar: user.avatar,
        publicId: user.publicId,
      }),
    );
  }

  // async refresh(req: Request, res: Response) {
  //     const { oldAccessToken, oldRefreshToken } = req.cookies || {};

  //     if (!oldAccessToken || !oldRefreshToken) {
  //         throw new APIError(400, "Authentication tokens are missing");
  //     }

  //     let userId: string | null = null;

  //     try {
  //         const decodedAccess: ITokenResponse = await tokenService.verifyAccessToken(oldAccessToken);
  //         userId = decodedAccess?._id;
  //     }
  //     catch (error:any) {
  //         if (error.name !== "TokenExpiredError") {
  //             throw new APIError(401, "Invalid access token structure");
  //         }
  //     }

  //     if (!userId) {
  //         let refreshTokenData: ITokenResponse | null = null;

  //         try {
  //             refreshTokenData = await tokenService.verifyRefreshToken(oldRefreshToken);
  //         }
  //         catch (error) {
  //             throw new APIError(401, "Refresh token expired or tampered. Please login again.");
  //         }

  //         if (!refreshTokenData || !refreshTokenData._id) {
  //             throw new APIError(401, "Login again, User not authenticated");
  //         }

  //         userId = refreshTokenData._id;

  //         const { accessToken, refreshToken } = tokenService.generateTokens({ _id: userId });

  //         res.cookie('refreshToken', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true, secure: true, sameSite: 'lax' });
  //         res.cookie('accessToken', accessToken, { maxAge: 1000 * 60 * 60 * 6, httpOnly: true, secure: true, sameSite: 'lax' });

  //         const user = await userservice.findUser({ _id: userId });
  //         if (!user) {
  //             throw new APIError(404, "User associated with this token no longer exists");
  //         }

  //         user.refreshToken = refreshToken;
  //         await user.save();
  //     }

  //     return res.status(200).json({
  //         success: true,
  //         message: "Tokens rotated successfully",
  //         userId
  //     });
  // }

  // async refresh(req:Request,res:Response){
  //     const {accessToken } = req.cookies
  //     const data = await tokenService.verifyAccessToken(accessToken)
  //     console.log(data)
  // }

  async refresh(req: Request, res: Response) {
    const { refreshToken: refreshTokenFromCookie } = req.cookies;
    // check if token is valid
    let userData;
    let user;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
    } catch (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    // Check if token is in db
    try {
      user = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie,
      );
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal error" });
    }
    // check if valid user
    // const user = await userservice.findUser({ _id: userData._id });
    // if (!user) {
    //     return res.status(404).json({ message: 'No user' });
    // }
    // Generate new tokens
    const { refreshToken, accessToken } = tokenService.generateTokens({
      _id: userData._id,
    });

    // Update refresh token
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: config.NODE_ENV === "production",
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 30,
      httpOnly: true,
      secure: config.NODE_ENV === "production",
    });

    // response
    const userDto = new UserDTO(user);
    return res.json({ user: userDto, auth: true });
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.json(new ApiResponse(200, "User logout successfully"));
  }
}

const authController = new AuthController();
export default authController;
