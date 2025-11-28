import express from "express";
import { getPosts } from "../controllers/post.ts";

const router = express.Router();
router.get("/", getPosts);

export default router;
