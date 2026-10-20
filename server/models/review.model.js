import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    listing: { type: String, required: true },
    user: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

reviewSchema.index({ listing: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
