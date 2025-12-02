import { type NextFunction, type Request, type Response } from "express";
import { HTTP_STATUS } from "../constants/index.ts";
import { verifyToken } from "../utils/generateToken.ts";
import { errorResponse } from "../utils/index.ts";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json(errorResponse("Access Token Required"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json(errorResponse("Invalid or Expired Access Token"));
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(errorResponse("Internal Server Error"));
  }
};
