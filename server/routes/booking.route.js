import express from 'express';
import {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/booking.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createBooking);
router.get('/mine', verifyToken, getMyBookings);
router.get('/received', verifyToken, getReceivedBookings);
router.post('/status/:id', verifyToken, updateBookingStatus);
router.post('/cancel/:id', verifyToken, cancelBooking);

export default router;
