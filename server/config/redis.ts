import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// 1. Tạo Client
const redisClient = createClient({
  // Nếu chạy docker compose map port 6379 ra localhost thì url là:
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// 2. Lắng nghe sự kiện lỗi (Quan trọng để debug)
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("⚡ Redis Client Connected"));

// 3. Export ra để dùng ở chỗ khác
export default redisClient;
