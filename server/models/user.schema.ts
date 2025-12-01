import mongoose from "mongoose";
const Schema = mongoose.Schema;
export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  bio: string;
  refresh_token: string;
}
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    refresh_token: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const User = mongoose.model<IUser>("User", userSchema);
export default User;
