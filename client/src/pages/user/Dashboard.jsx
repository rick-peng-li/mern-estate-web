import { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, List, Row, Spin, Statistic, Tag, Typography } from 'antd';
import {
  BellOutlined,
  BookOutlined,
  CalendarOutlined,
  HeartOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserListings } from '@/api/user.api';
import { getMyFavorites } from '@/api/favorite.api';
import { getMyBookings, getReceivedBookings } from '@/api/booking.api';
import { getMyNotifications } from '@/api/notification.api';
import { BOOKING_STATUS, formatDateTime } from '@/utils/status';

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [received, setReceived] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [listings, favorites, myBookings, receivedBookings, notifications] =
          await Promise.all([
            getUserListings(currentUser._id),
            getMyFavorites(),
            getMyBookings(),
            getReceivedBookings(),
            getMyNotifications(),
          ]);
        setReceived(receivedBookings.slice(0, 5));
        setStats({
          listings: listings.length,
          favorites: favorites.length,
          myBookings: myBookings.length,
          receivedBookings: receivedBookings.length,
          unread: notifications.unread,
        });
      } catch (error) {
        navigate('/sign-in');
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stats) {
    return (
      <div className="py-24 text-center">
        <Spin size="large" />
      </div>
    );
  }

  const cards = [
    { title: 'My Listings', value: stats.listings, icon: <HomeOutlined />, to: '/profile' },
    { title: 'Favorites', value: stats.favorites, icon: <HeartOutlined />, to: '/favorites' },
    { title: 'My Bookings', value: stats.myBookings, icon: <CalendarOutlined />, to: '/bookings' },
    { title: 'Received', value: stats.receivedBookings, icon: <BookOutlined />, to: '/bookings' },
    { title: 'Unread Alerts', value: stats.unread, icon: <BellOutlined />, to: '/bookings' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Typography.Title level={3} className="mb-0!">
            Welcome back, {currentUser.username} 👋
          </Typography.Title>
          <Typography.Text type="secondary">
            Here is an overview of your activity
          </Typography.Text>
        </div>
        <Avatar src={currentUser.avatar} size={56} alt="me" />
      </div>

      <Row gutter={[16, 16]}>
        {cards.map((card) => (
          <Col xs={12} sm={8} lg={4} key={card.title}>
            <Card hoverable onClick={() => navigate(card.to)} className="text-center">
              <Statistic title={card.title} value={card.value} prefix={card.icon} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mt-8">
        <Col xs={24} lg={16}>
          <Card
            title="Latest received booking requests"
            extra={<Link to="/bookings">View all</Link>}
          >
            {received.length === 0 ? (
              <Typography.Text type="secondary">No booking requests yet.</Typography.Text>
            ) : (
              <List
                dataSource={received}
                renderItem={(booking) => {
                  const status = BOOKING_STATUS[booking.status];
                  return (
                    <List.Item
                      actions={[
                        <Tag key="s" color={status.color}>
                          {status.label}
                        </Tag>,
                      ]}
                    >
                      <List.Item.Meta
                        title={booking.listingInfo?.name || 'Listing removed'}
                        description={`${booking.name} · ${formatDateTime(booking.date)}`}
                      />
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Quick actions">
            <div className="flex flex-col gap-3">
              <Button type="primary" block onClick={() => navigate('/create-listing')}>
                Create a listing
              </Button>
              <Button block onClick={() => navigate('/blog')}>
                Read real estate insights
              </Button>
              <Button block onClick={() => navigate('/search')}>
                Search listings
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
