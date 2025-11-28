import Post from "../models/post.schema.ts";
import type { Request, Response } from "express";
import { grpcSuccessResponse, grpcErrorResponse } from "../utils/response.ts";
import { Message, HTTP_STATUS } from "../constants/index.ts";
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res
      .status(HTTP_STATUS.OK)
      .json(grpcSuccessResponse(posts, Message.PostFound));
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(grpcErrorResponse(Message.PostNotFound));
  }
};
export const createPost = async (req: Request, res: Response) => {
  const post = req.body;
  const newPost = new Post(post);
  try {
    await newPost.save();
    res
      .status(HTTP_STATUS.CREATED)
      .json(grpcSuccessResponse(newPost, Message.PostCreated));
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(grpcErrorResponse(Message.PostNotCreated));
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
        .json(grpcSuccessResponse(updatedPost, Message.PostUpdated));
    }
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(grpcErrorResponse(Message.PostNotUpdated));
  }
};

// export const createPost = (req, res) => {
//   // Logic to create a new post in the database
//   res.send("Create a new post");
// };
