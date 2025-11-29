import express from "express";
import { authController } from "../controllers/auth.controller.ts";
const router = express.Router();

// Define your auth routes here
router.post("/login", authController.login);
router.put("/register", authController.register);
export default router;
