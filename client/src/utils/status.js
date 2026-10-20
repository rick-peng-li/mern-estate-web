export const BOOKING_STATUS = {
  pending: { label: 'Pending', color: 'orange' },
  confirmed: { label: 'Confirmed', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
};

export const POST_CATEGORY = {
  guide: { label: 'Buying Guide', color: 'blue' },
  market: { label: 'Market Analysis', color: 'purple' },
  lifestyle: { label: 'Lifestyle', color: 'cyan' },
  news: { label: 'News', color: 'orange' },
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
