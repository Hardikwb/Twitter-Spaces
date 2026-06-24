import RoomDTO from "../dtos/room.dto.js";
import roomModel, { type Iroom } from "../models/room.models.js"
import type { Iuser } from "../models/user.models.js";
import { APIError } from "../utils/APIError.js";

interface roomData{
    topic:string,
    roomType:string,
    ownerId:string,
    speakers:Iuser[],
}

class RoomService{
    async create(payload:roomData) {
        const { topic, roomType, ownerId,speakers} = payload;
        const room = await roomModel.create({
            topic,
            roomType,
            ownerId,
            speakers,
        });
        return room;
    }
    
    async findRoom(roomId:string){
        const room = await roomModel.findById(roomId)
        return room
    }
    async getAllRooms(types:string[]) {
        const rooms = await roomModel.find({ roomType: { $in: types } })
            .populate('speakers')
            .populate('ownerId')
            .exec();
        return rooms;
    }

    async getRoom(roomId:string) {
        const room:Iroom | null = await roomModel.findOne({ _id: roomId });
        if(!room){
            throw new APIError(400,"Room not exists")
        }
        // return (room);
        return new RoomDTO(room);
    }


}

const roomService = new RoomService()
export default roomService