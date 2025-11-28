import Post from "../models/post.schema.js";
import { Message, HTTP_STATUS } from "../constants/index.js";
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(HTTP_STATUS.OK).json(posts);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: Message.PostNotFound });
  }
};
export const createPost = (req, res) => {
  // Logic to create a new post in the database
  res.send("Create a new post");
};
  