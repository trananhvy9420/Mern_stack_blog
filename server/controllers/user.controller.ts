import User from "../models/user.schema.ts";
import type { Request, Response } from "express";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "../utils/response.ts";
import { getPaginatedData } from "../utils/paginationHelper.ts";
import { HTTP_STATUS, Message } from "../constants/index.ts";
import { extractMongooseValidationErrors } from "../utils/validation.ts";
export const userController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const { username, email } = req.query;
      let filter: Record<string, Object> = {};
      if (username) {
        filter.username = { $regex: username, $options: "i" };
      }
      if (email) {
        filter.email = { $regex: email, $options: "i" };
      }
      const users = await getPaginatedData(User, req.query, filter);
      res
        .status(HTTP_STATUS.OK)
        .json(successResponse(users, Message.UserFound));
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponse(Message.InternalServerError));
    }
  },
  createUser: async (req: Request, res: Response) => {
    try {
      const { username, email, password, profilePicture } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(errorResponse(Message.USER_ALREADY_EXISTS));
      }
      const newUser = await User.create({
        username,
        email,
        password,
        profilePicture,
      });
      res
        .status(HTTP_STATUS.CREATED)
        .json(successResponse(newUser, Message.UserCreated));
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const validationErrors = extractMongooseValidationErrors(error);
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(
            validationErrorResponse(
              "Dữ liệu bài viết không hợp lệ.",
              validationErrors
            )
          );
      }
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponse(Message.InternalServerError));
    }
  },
};
