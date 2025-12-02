import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// 1. Tạo Client
const redisClient = createClient({
  // Cấu hình URL đầy đủ: redis://:password@host:port
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

// 2. Lắng nghe sự kiện lỗi (Quan trọng để debug)
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("⚡ Redis Client Connected"));

// 3. Export ra để dùng ở chỗ khác
export default redisClient;
