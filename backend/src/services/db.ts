import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import config from "../config/config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI!);
    console.log("Connected to DB Successfully");
  } catch (error) {
    console.log("Error::", error);
  }
};

export default connectDB;
