import express from "express";
import { userController } from "../controllers/user.controller.ts";

const router = express.Router();

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
export default router;
