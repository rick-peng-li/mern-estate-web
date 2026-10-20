import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    cover: { type: String, required: true },
    category: {
      type: String,
      enum: ['guide', 'market', 'lifestyle', 'news'],
      default: 'guide',
    },
    author: { type: String, required: true },
    authorName: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
