import express from "express"
import authController from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post('/send-otp',authController.sendCode)
authRouter.post('/verify-otp',authController.verifyCode)

export default authRouter