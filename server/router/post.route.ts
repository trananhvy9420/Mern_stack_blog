import express from "express";
import {
  updatePost,
  seedData,
  postController,
} from "../controllers/post.controller.ts";

const router = express.Router();
router.route("/").get(postController.getPosts).post(postController.createPost);
router.route("/:id").patch(updatePost);
router.route("/seed-data").get(seedData);
export default router;
