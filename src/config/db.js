import mongoose from "mongoose";
import pkg from "mongodb-legacy";
const { MongoClient } = pkg;

// Hàm kết nối MongoDB với Mongoose
export const connectDB = async (uri) => {
  try {
    console.log("Connecting to database with URI:", uri);
    await mongoose.connect(uri);
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};
