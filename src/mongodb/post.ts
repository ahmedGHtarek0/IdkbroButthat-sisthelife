import mongoose, { Mongoose } from "mongoose";

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:''
  },
  discreption: {
    type: String,
    required: true,
  },
  photos:[
   {
    type:String,
}
],
  like: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  share: {
    type: Number,
    default:0
  },
  // العلاقات:
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
      default:[]
    },
  ],
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post= mongoose.model("Post", postSchema);
import zod, { number } from 'zod'
const postvalidtaor = zod.object({
    discreption: zod.string(), 
    category:zod.array(zod.string())
})
export {Post,postvalidtaor}