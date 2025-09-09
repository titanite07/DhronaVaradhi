import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

async function dbConnect() {
  try {
    if (!MONGODB_URI) {
      console.warn(
        "MONGODB_URI is not defined. Skipping MongoDB connection. Set MONGODB_URI in environment for DB access."
      );
      return;
    }

    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // rethrow so callers can handle the failure if needed
    throw error;
  }
}

export default dbConnect;
