import Post from "../models/post.schema.ts";
import type { Request, Response } from "express";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "../utils/response.ts";
import { getPaginatedData } from "../utils/paginationHelper.ts";
import { extractMongooseValidationErrors } from "../utils/validation.ts";
import { Message, HTTP_STATUS } from "../constants/index.ts";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { title, author, content } = req.query;
    let filter: any = {};
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }
    if (content) {
      filter.content = { $regex: content, $options: "i" };
    }
    const posts = await getPaginatedData(Post, req.query, filter);
    res.status(HTTP_STATUS.OK).json(successResponse(posts, Message.PostFound));
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(errorResponse(Message.PostNotFound));
  }
};
export const createPost = async (req: Request, res: Response) => {
  const post = req.body;
  const newPost = new Post(post);

  try {
    await newPost.validate();
    await newPost.save();
    res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(newPost, Message.PostCreated));
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const validationErrors = extractMongooseValidationErrors(error);
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(
          validationErrorResponse(
            "Dữ liệu bài viết không hợp lệ.",
            validationErrors
          )
        );
      return;
    }
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(errorResponse(Message.PostNotCreated));
  }
};
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = req.body;
  try {
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    if (updatedPost) {
      res
        .status(HTTP_STATUS.OK)
        .json(successResponse(updatedPost, Message.PostUpdated));
    }
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(errorResponse(Message.PostNotUpdated));
  }
};

// export const createPost = (req, res) => {
//   // Logic to create a new post in the database
//   res.send("Create a new post");
// };
