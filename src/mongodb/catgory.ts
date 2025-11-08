import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", 
      default:[]
    },
  ],
});

const Category = mongoose.model("Category", categorySchema);

import zod from 'zod'
const categoryValidoator= zod.object({
    name:zod .string().min(1,'  1 is the min category name bro').max(100,'the 100  is the  max name bro')
})
export { Category,categoryValidoator};
