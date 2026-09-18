import mongoose from "mongoose";
import "dotenv/config";

const state = { isConnected: false };

export const connectDB = async () => {
  if (state.isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "rustbucket",
    });
    state.isConnected = conn.connection.readyState === 1;
    console.log(`Database connected: ${conn.connection.host} (db: rustbucket)`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
