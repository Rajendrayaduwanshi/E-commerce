import mongoose from "mongoose";

let isConnected = false; // Track connection state

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "ecommerce", // database name
    });
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error", error);
  }
};
