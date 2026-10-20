import Booking from '../models/booking.model.js';
import Listing from '../models/listing.model.js';
import Notification from '../models/notification.model.js';
import { errorHandler } from '../utils/error.js';

const notify = (userId, title, message, link) =>
  Notification.create({ user: userId, title, message, link });

export const createBooking = async (req, res, next) => {
  try {
    const { listingId, name, email, phone, date, message } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return next(errorHandler(404, 'Listing not found!'));
    if (listing.userRef === req.user.id)
      return next(errorHandler(400, 'You cannot book your own listing!'));

    const booking = await Booking.create({
      listing: listingId,
      user: req.user.id,
      landlord: listing.userRef,
      name,
      email,
      phone,
      date,
      message,
    });

    await notify(
      listing.userRef,
      'New viewing request',
      `${name} requested a viewing for "${listing.name}"`,
      '/bookings'
    );

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    const withListings = await Promise.all(
      bookings.map(async (b) => {
        const listing = await Listing.findById(b.listing).select(
          'name imageUrls address regularPrice discountPrice offer type'
        );
        return { ...b.toObject(), listingInfo: listing };
      })
    );
    res.status(200).json(withListings);
  } catch (error) {
    next(error);
  }
};

export const getReceivedBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ landlord: req.user.id }).sort({
      createdAt: -1,
    });
    const withListings = await Promise.all(
      bookings.map(async (b) => {
        const listing = await Listing.findById(b.listing).select(
          'name imageUrls address regularPrice discountPrice offer type'
        );
        return { ...b.toObject(), listingInfo: listing };
      })
    );
    res.status(200).json(withListings);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(errorHandler(404, 'Booking not found!'));
    if (booking.landlord !== req.user.id)
      return next(errorHandler(401, 'You can only manage your own bookings!'));

    booking.status = status;
    await booking.save();

    await notify(
      booking.user,
      'Booking status updated',
      `Your viewing request for "${booking.name}" is now ${status}`,
      '/bookings'
    );

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(errorHandler(404, 'Booking not found!'));
    if (booking.user !== req.user.id && booking.landlord !== req.user.id)
      return next(errorHandler(401, 'Unauthorized!'));

    booking.status = 'cancelled';
    await booking.save();

    const notifyUser =
      req.user.id === booking.user ? booking.landlord : booking.user;
    await notify(
      notifyUser,
      'Booking cancelled',
      `The viewing request for "${booking.name}" was cancelled`,
      '/bookings'
    );

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};
