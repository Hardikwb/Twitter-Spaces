import type { Iuser } from "../models/user.models.js";

class SpeakerDTO{
    public _id:string;
    public username:string;
    public avatar:string;

    constructor(user:Iuser){
        this._id = user._id.toString();
        this.username = user.username;
        this.avatar = user?.avatar ?? "";
    }
}

export default SpeakerDTO;