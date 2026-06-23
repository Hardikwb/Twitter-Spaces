import { getTRPCErrorFromUnknown } from "@trpc/server";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
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

const userModel = mongoose.model("user", userSchema);
export default userModel;
