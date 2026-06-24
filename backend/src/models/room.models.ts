import mongoose, {Schema, Types} from "mongoose"
import type { Iuser } from "./user.models.js"

export interface Iroom{
    _id:Types.ObjectId;
    topic:string;
    roomType:string;
    ownerId:Types.ObjectId;
    speakers:Iuser[];
}


const roomSchema = new Schema<Iroom>({
    topic:{
        type:String,
        require:true
    },
    roomType:{
        type:String,
        require:true
    },
    ownerId:{
        type:Schema.Types.ObjectId,
        require:true
    },
    speakers: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        required: false,
    },
},{timestamps:true})

const roomModel = mongoose.model("Room",roomSchema)
export default roomModel