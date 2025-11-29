import User from "../models/user.schema.ts";
import type { Request, Response } from "express";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "../utils/response.ts";
import { getPaginatedData } from "../utils/paginationHelper.ts";
import { HTTP_STATUS, Message } from "../constants/index.ts";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.query;
    let filter: Record<string, Object> = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }
    const users = await getPaginatedData(User, req.query, filter);
    res.status(HTTP_STATUS.OK).json(successResponse(users, Message.UserFound));
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(errorResponse(Message.InternalServerError));
  }
};
