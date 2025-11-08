import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  postid: {
    type: mongoose.Schema.Types.ObjectId, // ← العلاقة مع الـ Post
    ref: "Post",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);
import zod from 'zod' 
const commentvalidator= zod.object({
     postid: zod.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"), // ← ده regex خاص بـ ObjectId
})
export  {Comment,commentvalidator};
