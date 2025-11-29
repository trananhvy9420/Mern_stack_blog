import express from "express";
import {
  getPosts,
  createPost,
  updatePost,
  seedData,
} from "../controllers/post.controller.ts";

const router = express.Router();
router.route("/").get(getPosts).post(createPost);
router.route("/:id").patch(updatePost);
router.route("/seed-data").get(seedData);
export default router;
