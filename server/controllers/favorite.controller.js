import Favorite from '../models/favorite.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const toggleFavorite = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    const existing = await Favorite.findOne({
      user: req.user.id,
      listing: listingId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ favorited: false });
    }

    await Favorite.create({ user: req.user.id, listing: listingId });
    res.status(200).json({ favorited: true });
  } catch (error) {
    next(error);
  }
};

export const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    const listingIds = favorites.map((f) => f.listing);
    const listings = await Listing.find({ _id: { $in: listingIds } });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const checkFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      listing: req.params.listingId,
    });
    res.status(200).json({ favorited: !!favorite });
  } catch (error) {
    next(error);
  }
};
