import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

if (!MONGODB_URI) {
    console.error("DB_URL is undefined. Make sure it's correctly defined in the .env file.");
    process.exit(1); // Exit the app if DB_URL is missing
  }

export default connectDB;
