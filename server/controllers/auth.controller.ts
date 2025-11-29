import express from "express";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.schema.ts";
import { HTTP_STATUS, Message } from "../constants/index.ts";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.ts";
export const authController = {
  register: async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: Message.USER_ALREADY_EXISTS });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res
        .status(HTTP_STATUS.CREATED)
        .json({ message: Message.USER_REGISTERED_SUCCESSFULLY });
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: Message.InternalServerError, error });
    }
  },
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const access_token = generateAccessToken(user);
      const refresh_token = generateRefreshToken(user);
      const token = { access_token, refresh_token };
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  },
};
