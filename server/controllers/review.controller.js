import Review from '../models/review.model.js';
import { errorHandler } from '../utils/error.js';

export const createReview = async (req, res, next) => {
  try {
    const { listingId, rating, comment } = req.body;
    const review = await Review.findOneAndUpdate(
      { listing: listingId, user: req.user.id },
      {
        listing: listingId,
        user: req.user.id,
        username: req.body.username,
        avatar: req.body.avatar,
        rating,
        comment,
      },
      { new: true, upsert: true }
    );
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const getListingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId }).sort({
      createdAt: -1,
    });
    const average =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
    res.status(200).json({ reviews, average, total: reviews.length });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(errorHandler(404, 'Review not found!'));
    if (review.user !== req.user.id)
      return next(errorHandler(401, 'You can only delete your own review!'));

    await review.deleteOne();
    res.status(200).json('Review has been deleted!');
  } catch (error) {
    next(error);
  }
};
