import express from "express";
import bodyParser from "body-parser";
import redisClient from "./config/redis.ts";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import posts from "./router/post.route.ts";
import users from "./router/user.route.ts";
import auth from "./router/auth.route.ts";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const URI = (process.env.MONGO_URI as String).toString();
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// mongoose connection removed (handled in startServer)
const startServer = async () => {
  try {
    // --- KẾT NỐI MONGODB (Của bạn có sẵn rồi) ---
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("🐢 MongoDB Connected");

    // --- KẾT NỐI REDIS (Thêm đoạn này) ---
    await redisClient.connect();
    // Lưu ý: Phải await nó kết nối xong thì mới dùng được

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Lỗi khởi động server:", error);
  }
};

startServer();
app.use("/posts", posts);
app.use("/users", users);
app.use("/auth", auth);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Duplicate app.listen removed
