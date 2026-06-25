import mongoose, { Schema, Types } from "mongoose";

export interface Iuser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  activated: boolean;
  refreshToken?: string;
  avatar?: string;
  publicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const userSchema = new Schema<Iuser>(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    activated: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: String,
    },
    publicId: {
      type: String,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
