import dotenv from "dotenv"
dotenv.config()

const config ={
    PORT : process.env.PORT || 3000,
    DOMAIN: process.env.DOMAIN,
    MONGODB_URI: process.env.MONGODB_URI,
    RESEND: process.env.RESEND_API_KEY,
    HASH_SECRET: process.env.HASH_SECRET,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,

}

export default config