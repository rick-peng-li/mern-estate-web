import express from 'express';
import {
  toggleFavorite,
  getMyFavorites,
  checkFavorite,
} from '../controllers/favorite.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/toggle', verifyToken, toggleFavorite);
router.get('/mine', verifyToken, getMyFavorites);
router.get('/check/:listingId', verifyToken, checkFavorite);

export default router;
