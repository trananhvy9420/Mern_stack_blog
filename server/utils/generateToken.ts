import jwt from "jsonwebtoken";
import type { IUser } from "../models/user.schema";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "15m",
  });
};
export const generateRefreshToken = (user: IUser) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
};
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
