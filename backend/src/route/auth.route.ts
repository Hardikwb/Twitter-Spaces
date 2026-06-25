import express from "express";
import authController from "../controllers/auth.controller.js";
import { upload } from "../middleware/multer.js";
import authMiddleWare from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/send-otp", authController.sendCode);
authRouter.post("/verify-otp", authController.verifyCode);
authRouter.post(
  "/activate",
  upload.single("avatar"),
  authMiddleWare,
  authController.activate,
);
authRouter.get("/refresh", authController.refresh);
authRouter.get("/logout", authMiddleWare, authController.logout);

export default authRouter;
