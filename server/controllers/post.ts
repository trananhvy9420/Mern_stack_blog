import Post from "../models/post.schema.ts";
import type { Request, Response } from "express";
import { Message, HTTP_STATUS } from "../constants/index.ts";
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.status(HTTP_STATUS.OK).json(posts);
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: Message.PostNotFound });
  }
};
export const createPost = async (req: Request, res: Response) => {
  const post = req.body;
  const newPost = new Post(post);
  try {
    await newPost.save();
    const response = {
      message: Message.PostCreated,
      data: newPost,
    };
    res.status(HTTP_STATUS.CREATED).json(response);
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: Message.PostNotCreated });
  }
};
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = req.body;
  try {
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    if (updatedPost) {
      const response = {
        message: Message.PostUpdated,
        data: updatedPost,
      };
      res.status(HTTP_STATUS.OK).json(response);
    } else {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: Message.PostNotFound });
    }
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: Message.PostNotUpdated });
  }
};

// export const createPost = (req, res) => {
//   // Logic to create a new post in the database
//   res.send("Create a new post");
// };
