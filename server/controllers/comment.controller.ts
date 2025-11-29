import Comment from "../models/comment.schema.ts";
import type { Request, Response } from "express";
import { Message, HTTP_STATUS } from "../constants/index.ts";
import {
  errorResponse,
  successResponse,
  getPaginatedData,
} from "../utils/index.ts";
export const commentController = {
  getComments: async (req: Request, res: Response) => {
    try {
      const { user_id, post_id } = req.query;
      let filter: Record<string, any> = {};
      if (user_id) {
        filter.userId = { $regex: user_id, $options: "i" };
      }
      if (post_id) {
        filter.postId = { $regex: post_id, $options: "i" };
      }
      const comments = await getPaginatedData(Comment, req.query, filter);
      res.status(HTTP_STATUS.OK).json(successResponse(comments));
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponse(Message.CommentNotFound));
    }
  },
};
