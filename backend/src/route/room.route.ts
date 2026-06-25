import express from "express";
import roomController from "../controllers/room.controller.js";
import authMiddleWare from "../middleware/auth.middleware.js";

const roomRouter = express.Router();

roomRouter.post("/rooms", authMiddleWare, roomController.createRoom);
roomRouter.get("/rooms", authMiddleWare, roomController.roomsIndex);
roomRouter.get("/rooms/:roomId", authMiddleWare, roomController.showRoom);

export default roomRouter;
