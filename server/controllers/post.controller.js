import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const getPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const query = Post.find().sort({ createdAt: -1 });
    if (limit > 0) query.limit(limit);
    const posts = await query;
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(errorHandler(404, 'Post not found!'));
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      ...req.body,
      author: req.user.id,
    });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(errorHandler(404, 'Post not found!'));
    if (post.author !== req.user.id)
      return next(errorHandler(401, 'You can only delete your own posts!'));

    await post.deleteOne();
    res.status(200).json('Post has been deleted!');
  } catch (error) {
    next(error);
  }
};
