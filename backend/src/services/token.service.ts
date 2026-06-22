import jwt from "jsonwebtoken"
import crypto from "node:crypto"
import config from "../config/config.js"

class TokenService{
    generateTokens(payload:object){
        const accessToken = jwt.sign(payload,config.ACCESS_TOKEN_SECRET!,{
            expiresIn:"1h"
        })
        const refreshToken = jwt.sign(payload,config.REFRESH_TOKEN_SECRET!,{
            expiresIn:"30d"
        })
        return {accessToken,refreshToken}
    }
}

const tokenService = new TokenService()
export default tokenService