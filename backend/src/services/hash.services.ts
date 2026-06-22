import crypto from "node:crypto"
import config from "../config/config.js"

class HashService{
    hashData (data:string){
    return crypto
                .createHmac("sha256",config.HASH_SECRET!)
                .update(data)
                .digest('hex')
    }
}

export default new HashService()