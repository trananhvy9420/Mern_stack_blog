import express from "express";
import { getPosts } from "../controllers/post.js";

const router = express.Router(); 
router.get("/", getPosts);

router.get("/:id", (req, res) => {
  res.send("Post route with id");
});

export default router;
