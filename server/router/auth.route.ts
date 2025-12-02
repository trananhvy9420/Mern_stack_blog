import express from "express";
import { authController } from "../controllers/auth.controller.ts";
import { verifyAccessToken } from "../middleware/auth.middleware.ts";
const router = express.Router();

// Define your auth routes here
router.post("/login", authController.login);
router.put("/register", authController.register);
router.put("/refresh-token", authController.refreshToken);
router.get("/me", verifyAccessToken, authController.getMe);
export default router;
