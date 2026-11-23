import mongoose from "mongoose";
import { env } from "./env";

const globalCache = globalThis as unknown as {
  __mongoose?: { conn?: typeof mongoose; promise?: Promise<typeof mongoose> };
};
const cache = (globalCache.__mongoose ??= {});

export async function connectDb() {
  if (!process.env.MONGODB_URI) throw new Error("No database configured");
  if (cache.conn && cache.conn.connection.readyState === 1) return cache.conn;
  cache.promise ??= mongoose.connect(env().MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 2000,
    connectTimeoutMS: 2000,
  });
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = undefined;
    cache.conn = undefined;
    throw err;
  }
  return cache.conn;
}
