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
import User from "../models/user.schema.ts";
import Comment from "../models/comment.schema.ts";
export const seedData = async (req: Request, res: Response) => {
  try {
    // 1. Xóa dữ liệu cũ (Tùy chọn - để tránh rác database)
    // Nếu bạn muốn giữ dữ liệu cũ thì comment 3 dòng dưới lại
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // 2. TẠO USER (Người dùng)
    const newUser = await User.create({
      username: "nguoi_dung_test_" + Date.now(), // Thêm số ngẫu nhiên để không trùng
      email: `test${Date.now()}@gmail.com`,
      password: "password123", // Password giả
      profilePicture: "https://i.pravatar.cc/150?img=3",
    });

    console.log("-> Đã tạo User:", newUser._id);

    // 3. TẠO POST (Bài viết) - Lúc đầu chưa có comment nào
    const newPost = await Post.create({
      title: "Bài viết Test Populate " + new Date().toLocaleTimeString(),
      content: "Đây là bài viết được tạo tự động để test tính năng Comment.",
      author: "Admin Bot",
      comments: [], // Mảng rỗng
    });

    console.log("-> Đã tạo Post:", newPost._id);

    // 4. TẠO COMMENT (Bình luận) - Gắn kết User và Post vào đây
    const newComment = await Comment.create({
      content: "Code chạy ngon rồi nhé! Dữ liệu đã khớp.",
      userId: newUser._id, // Lấy ID của User vừa tạo ở bước 2
      postId: newPost._id, // Lấy ID của Post vừa tạo ở bước 3
    });

    console.log("-> Đã tạo Comment:", newComment._id);

    // 5. BƯỚC QUAN TRỌNG NHẤT: CẬP NHẬT POST
    // Đẩy ID của Comment vừa tạo vào mảng 'comments' của bài Post
    await Post.findByIdAndUpdate(newPost._id, {
      $push: { comments: newComment._id },
    });

    // 6. Trả kết quả về
    res.status(200).json({
      success: true,
      message: "Đã tạo dữ liệu đồng bộ thành công!",
      data: {
        user: newUser,
        post: newPost,
        comment: newComment,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi khi tạo dữ liệu", details: error });
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
export const postController = {
  getPosts: async (req: Request, res: Response) => {
    try {
      const { title, author, content } = req.query;
      let filter: Record<string, Object> = {};
      if (title) filter.title = { $regex: title, $options: "i" };
      if (author) filter.author = { $regex: author, $options: "i" };
      if (content) filter.content = { $regex: content, $options: "i" };
      const populateOptions = {
        path: "comments",
        select: "content createdAt",
        populate: {
          path: "userId",
          select: "username email profilePicture",
        },
      };
      const posts = await getPaginatedData(Post, req.query, filter, {
        populate: populateOptions,
      });
      res
        .status(HTTP_STATUS.OK)
        .json(successResponse(posts, Message.PostFound));
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(errorResponse(Message.PostNotFound));
    }
  },
  createPost: async (req: Request, res: Response) => {
    const post = req.body;
    const newPost = new Post(post);
    try {
      await newPost.validate();
      await newPost.save();
      res
        .status(HTTP_STATUS.CREATED)
        .json(successResponse(newPost, Message.PostCreated));
    } catch (error) {
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
  },
  getDetailPost: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const post = await Post.findById(id).populate({
        path: "comments",
        select: "content createdAt",
        populate: {
          path: "userId",
          select: "username email profilePicture",
        },
      });
      if (!post) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(errorResponse(Message.PostNotFound));
        return;
      }
      res.status(HTTP_STATUS.OK).json(successResponse(post, Message.PostFound));
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error", error: error });
    }
  },
};
