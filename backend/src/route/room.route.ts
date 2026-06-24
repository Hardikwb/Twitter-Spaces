import express from "express"
import roomController from "../controllers/room.controller.js"
import authMiddleWare from "../middleware/auth.middleware.js"

const roomRouter = express.Router()


roomRouter.post('/room',authMiddleWare,roomController.createRoom)
roomRouter.get('/room',authMiddleWare,roomController.roomsIndex)
roomRouter.get('/room/:id',authMiddleWare,roomController.showRoom)


export default roomRouter