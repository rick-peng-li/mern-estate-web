import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Empty,
  List,
  Segmented,
  Spin,
  Tag,
  Typography,
} from 'antd';
import {
  cancelBooking,
  getMyBookings,
  getReceivedBookings,
  updateBookingStatus,
} from '@/api/booking.api';
import { BOOKING_STATUS, formatDateTime } from '@/utils/status';

export default function MyBookings() {
  const { message } = App.useApp();
  const [tab, setTab] = useState('mine');
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async (which = tab) => {
    setLoading(true);
    try {
      const data =
        which === 'mine' ? await getMyBookings() : await getReceivedBookings();
      setBookings(data);
    } catch (error) {
      message.error(error.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      message.success(`Booking ${status}`);
      load();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      message.success('Booking cancelled');
      load();
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Typography.Title level={3}>Viewing Bookings</Typography.Title>
      <Segmented
        className="mb-6"
        value={tab}
        onChange={setTab}
        options={[
          { label: 'My requests', value: 'mine' },
          { label: 'Received requests', value: 'received' },
        ]}
      />
      {loading && (
        <div className="py-16 text-center">
          <Spin size="large" />
        </div>
      )}
      {!loading && bookings && bookings.length === 0 && (
        <Empty description="No bookings yet" className="my-16" />
      )}
      {!loading && bookings && bookings.length > 0 && (
        <List
          dataSource={bookings}
          renderItem={(booking) => {
            const status = BOOKING_STATUS[booking.status];
            return (
              <List.Item
                className="rounded-xl! border border-gray-100 bg-white mb-3 px-4! shadow-sm"
                actions={[
                  <Tag key="status" color={status.color}>
                    {status.label}
                  </Tag>,
                  ...(tab === 'received' && booking.status === 'pending'
                    ? [
                        <Button
                          key="confirm"
                          type="primary"
                          size="small"
                          onClick={() => handleStatus(booking._id, 'confirmed')}
                        >
                          Confirm
                        </Button>,
                        <Button
                          key="reject"
                          danger
                          size="small"
                          onClick={() => handleStatus(booking._id, 'cancelled')}
                        >
                          Decline
                        </Button>,
                      ]
                    : []),
                  ...(tab === 'mine' && booking.status !== 'cancelled'
                    ? [
                        <Button
                          key="cancel"
                          danger
                          size="small"
                          onClick={() => handleCancel(booking._id)}
                        >
                          Cancel
                        </Button>,
                      ]
                    : []),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    booking.listingInfo && (
                      <img
                        src={booking.listingInfo.imageUrls[0]}
                        alt="listing"
                        className="h-16 w-24 rounded-lg object-cover"
                      />
                    )
                  }
                  title={
                    <Typography.Link
                      onClick={() =>
                        booking.listingInfo &&
                        window.location.assign(`/listing/${booking.listing}`)
                      }
                    >
                      {booking.listingInfo?.name || 'Listing removed'}
                    </Typography.Link>
                  }
                  description={
                    <div className="text-xs!">
                      <p className="mb-0!">
                        {tab === 'mine' ? 'Viewing at' : 'Requested by'}{' '}
                        <strong>{formatDateTime(booking.date)}</strong>
                        {tab === 'received' && ` — ${booking.name} (${booking.email}, ${booking.phone})`}
                      </p>
                      {booking.message && (
                        <p className="mb-0! text-gray-500">“{booking.message}”</p>
                      )}
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
}
