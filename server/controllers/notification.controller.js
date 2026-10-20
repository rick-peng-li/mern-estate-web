import Notification from '../models/notification.model.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    const unread = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });
    res.status(200).json({ notifications, unread });
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );
    res.status(200).json('All notifications marked as read');
  } catch (error) {
    next(error);
  }
};
