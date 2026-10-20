import express from 'express';
import {
  getMyNotifications,
  markAllRead,
} from '../controllers/notification.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/mine', verifyToken, getMyNotifications);
router.post('/read-all', verifyToken, markAllRead);

export default router;
