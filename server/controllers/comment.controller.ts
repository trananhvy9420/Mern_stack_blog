import Comment from "../models/comment.schema";
import type { Request, Response } from "express";
import { Message, HTTP_STATUS } from "../constants/index.ts";
import {
  errorResponse,
  successResponse,
  getPaginatedData,
} from "../utils/index.ts";
export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId, userId } = req.query;
    const filter: Record<string, Object> = {};
    if (postId) {
      filter.postId = { $regex: postId, $options: "i" };
    }
    if (userId) {
      filter.userId = { $regex: userId, $options: "i" };
    }
    const paginatedComments = await getPaginatedData(
      Comment,
      req.query,
      filter
    );
    res.status(HTTP_STATUS.OK).json(paginatedComments);
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(errorResponse(Message.InternalServerError));
  }
};
