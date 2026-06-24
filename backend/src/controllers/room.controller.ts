import type {Request,Response} from "express"
import { APIError } from "../utils/APIError.js"
import RoomDTO, { type RoomType } from "../dtos/room.dto.js"
import roomService from "../services/room.services.js"
import { ApiResponse } from "../utils/APIResponse.js"
import SpeakerDTO from "../dtos/speaker.dto.js"
import userservice from "../services/user.services.js"

interface CustomRequest extends Request{
    user?:any;
    params:{roomId:string}
}

class RoomController{
    async createRoom(req:CustomRequest,res:Response){
        const {topic,roomType,speakers} = req.body
        
        console.log("Topic",topic)
        console.log("RoomType::",roomType)
        console.log("Speakers::",speakers)
        const user = req.user
        // console.log("USER::ROOMS::CREATION::",user)

        if(!topic || !roomType){
            throw new APIError(400,"All fields are required")
        }

        const newRoom = await roomService.create({
            topic:topic,
            roomType:roomType,
            ownerId:user._id.toString(),
            speakers:[user._id]
            // speakers:speakers
        })
        console.log("ROOM::CREATED",newRoom)
        console.log("ROOM::DTO::INSTANCE::",new RoomDTO(newRoom))
        return res.json({newRoom:new RoomDTO(newRoom)});
    }
    
    async roomsIndex(req: Request, res: Response) {
    try {
        const rooms = await roomService.getAllRooms(['Open']);
        const allRooms = rooms.map(room =>(
                new RoomDTO(room)
        ));
        
        // return res.json(new ApiResponse(200,"Fetched all rooms successfully",allRooms));
        // return res.json({allRooms:allRooms});
        return res.json(allRooms);
    } catch (error) {
        console.log("Error::Fetching:Rooms::", error);
        return res.json(new ApiResponse(500,"Error"));

    }
}
    async showRoom(req:CustomRequest, res:Response) {
        const room = await roomService.getRoom(req.params.roomId);
        return res.json(room);
    }
}

const roomController = new RoomController()
export default roomController