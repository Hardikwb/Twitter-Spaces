import type { Types } from "mongoose";
import SpeakerDTO from "./speaker.dto.js";
import type { Iroom } from "../models/room.models.js";

export interface  RoomType {
    _id: Types.ObjectId;
    ownerId: Types.ObjectId | string ;
    topic: string;
    roomType: string ;
    createdAt?: Date;
    updatedAt?: Date;
    speakers: SpeakerDTO[];
}

class RoomDTO{
    public _id:string;
    public topic:string;
    public ownerId:string;
    public roomType:string;
    public speakers:SpeakerDTO[];
    
    constructor(room:Iroom){
        this._id = room._id.toString();
        this.topic = room.topic ?? "";
        this.ownerId = room.ownerId.toString() ?? "";
        this.roomType = room.roomType ?? "";
        this.speakers = room.speakers?.map(s => new SpeakerDTO(s)) ?? [];
    }    
}

export default RoomDTO; 