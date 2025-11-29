import express from "express";
import { getUsers } from "../controllers/user.ts";

const router = express.Router();

router.get("/", getUsers);
export default router;
