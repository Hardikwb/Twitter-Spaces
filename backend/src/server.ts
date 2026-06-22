import express from "express"
import cors from "cors"
import config from "./config/config.js"
import authRouter from "./route/auth.route.js"
import connectDB from "./services/db.js"

const app = express()
const PORT = config.PORT
const DOMAIN = config.DOMAIN

connectDB()

const corsOptions={
    // origin:['http://localhost:3000']
    origin:'*'
}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/',(req,res)=>{
    return res.send("Hello")
})

app.use('/api/auth', authRouter)


app.listen(PORT,()=>{
    console.log(`App listening on ${DOMAIN}:${PORT}`)
})