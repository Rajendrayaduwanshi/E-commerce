import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_NAME || "ecommerce";

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to your .env file");
}

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<typeof mongoose> | null;
}

// Global cache to prevent multiple connections in dev mode
let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      bufferCommands: false,
    });
  }

  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance.connection;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn!;
}
