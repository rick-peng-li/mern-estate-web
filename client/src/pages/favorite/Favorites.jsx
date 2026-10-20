import { useEffect, useState } from 'react';
import { App, Button, Card, Col, Empty, Row, Spin, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getMyFavorites, toggleFavorite } from '@/api/favorite.api';
import { formatPrice } from '@/utils/format';

export default function Favorites() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [listings, setListings] = useState(null);

  useEffect(() => {
    getMyFavorites()
      .then(setListings)
      .catch(() => setListings([]));
  }, []);

  const handleRemove = async (listingId) => {
    try {
      await toggleFavorite(listingId);
      setListings((prev) => prev.filter((l) => l._id !== listingId));
      message.success('Removed from favorites');
    } catch (error) {
      message.error(error.message);
    }
  };

  if (!listings) {
    return (
      <div className="py-24 text-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Typography.Title level={3}>My Favorites</Typography.Title>
      {listings.length === 0 ? (
        <Empty description="No favorites yet">
          <Button type="primary" onClick={() => navigate('/search')}>
            Browse listings
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {listings.map((listing) => (
            <Col xs={24} sm={12} lg={8} key={listing._id}>
              <Card
                hoverable
                styles={{ body: { padding: 12 } }}
                cover={
                  <img
                    alt={listing.name}
                    src={listing.imageUrls[0]}
                    className="h-44 w-full object-cover"
                    onClick={() => navigate(`/listing/${listing._id}`)}
                  />
                }
              >
                <Typography.Text strong className="block truncate">
                  {listing.name}
                </Typography.Text>
                <Typography.Text type="secondary" className="block truncate text-xs!">
                  {listing.address}
                </Typography.Text>
                <div className="mt-2 flex items-center justify-between">
                  <Typography.Text strong className="text-green-700!">
                    ${formatPrice(listing.offer ? listing.discountPrice : listing.regularPrice)}
                    {listing.type === 'rent' && '/mo'}
                  </Typography.Text>
                  <Button danger size="small" onClick={() => handleRemove(listing._id)}>
                    Remove
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
