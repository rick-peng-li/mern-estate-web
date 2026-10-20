import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    listing: { type: String, required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, listing: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
