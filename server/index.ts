import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
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
app.use(cors());
mongoose
  .connect(URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
app.use("/posts", posts);
app.use("/users", users);
app.use("/auth", auth);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
