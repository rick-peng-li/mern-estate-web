import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  deletePost,
} from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/all', getPosts);
router.get('/:id', getPost);
router.post('/create', verifyToken, createPost);
router.delete('/:id', verifyToken, deletePost);

export default router;
