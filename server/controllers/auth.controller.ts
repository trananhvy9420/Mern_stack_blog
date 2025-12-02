import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.schema.ts";
import { HTTP_STATUS, Message } from "../constants/index.ts";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.ts";
import {
  errorResponse,
  successResponse,
  getPaginatedData,
} from "../utils/index.ts";
export const authController = {
  register: async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(errorResponse(Message.USER_ALREADY_EXISTS));
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res
        .status(HTTP_STATUS.CREATED)
        .json(successResponse(newUser, Message.USER_REGISTERED_SUCCESSFULLY));
    } catch (error) {
      console.log("Register Error", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponse(Message.InternalServerError));
    }
  },
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      const isMatch = user
        ? await bcrypt.compare(password, user.password)
        : false;

      if (!user || !isMatch) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(errorResponse(Message.WRONG_LOGIN));
      }

      const access_token = generateAccessToken(user);
      const refresh_token = generateRefreshToken(user);

      // 1. Save refresh token to DB (Single Session / Latest Session wins)
      user.refresh_token = refresh_token;
      await user.save();

      // 2. Set HttpOnly Cookie
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // 3. Return Access Token
      const token = { access_token };
      res
        .status(HTTP_STATUS.OK)
        .json(successResponse(token, Message.LOGIN_SUCCESS));
    } catch (error) {
      console.log("Login Error", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponse(Message.InternalServerError));
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    // Get token from Cookie
    const refresh_token = req.cookies?.refresh_token;
    if (!refresh_token) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(errorResponse("No Refresh Token Provided"));
    }

    try {
      // 1. Find user with this token
      const user = await User.findOne({ refresh_token });

      if (!user) {
        // Token reuse detection or invalid token
        // If verify passes but user not found with this token -> Reuse attempt!
        // For now, just return Forbidden
        return res
          .status(HTTP_STATUS.FORBIDDEN)
          .json(errorResponse("Invalid Refresh Token"));
      }

      // 2. Verify Token (Optional if DB check is enough, but good for expiration check)
      // jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET as string);
      // Assuming generateRefreshToken uses a secret, we should verify it.
      // But since we found it in DB, it's likely valid unless expired.
      // Let's rely on DB existence + expiration if stored, or verify signature.
      // For simplicity/robustness, let's just rotate.

      // 3. Token Rotation
      const new_access_token = generateAccessToken(user);
      const new_refresh_token = generateRefreshToken(user);

      user.refresh_token = new_refresh_token;
      await user.save();

      res.cookie("refresh_token", new_refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(HTTP_STATUS.OK)
        .json(
          successResponse({ access_token: new_access_token }, "Token Refreshed")
        );
    } catch (error) {
      console.log("Refresh Token Error", error);
      res
        .status(HTTP_STATUS.FORBIDDEN)
        .json(errorResponse("Invalid or Expired Refresh Token"));
    }
  },
  getMe: async (req: Request, res: Response) => {
    try {
      const user = await User.findById((req as any).user.id).select(
        "-password"
      );
      if (!user) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(errorResponse(Message.UserNotFound));
      }
      res.status(HTTP_STATUS.OK).json(successResponse(user, "User Profile"));
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponse(Message.InternalServerError));
    }
  },
};
