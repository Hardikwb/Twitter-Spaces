import type mongoose from "mongoose";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  activated: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  refreshToken?: string;
  avatar?: string;
}

export class UserDTO {
  public _id: string;
  public username: string;
  public email: string;
  public createdAt: Date | string;
  public activated: boolean;
  public refreshToken: string = "";
  public avatar: string = "";

  constructor(user: any) {
    this._id = user._id.toString();
    this.username = user.username;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.activated = user.activated;
    this.refreshToken = user.refreshToken || "";
    this.avatar = user.avatar || "";
  }
}
export default UserDTO;
