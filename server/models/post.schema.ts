import mongoose from "mongoose";
const Schema = mongoose.Schema;
interface IPost extends mongoose.Document {
  title: string;
  content: string;
  author: string;
  attachment: string;
  likeCount: number;
  comments: mongoose.Types.ObjectId[] | any[];
  users: mongoose.Types.ObjectId[] | any[];
}
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      default: "Anonymous",
    },
    attachment: String,
    likeCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
