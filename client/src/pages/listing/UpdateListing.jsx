import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { App, Spin, Typography } from 'antd';
import { updateListing, getListing } from '@/api/listing.api';
import ListingForm from '@/components/listing/ListingForm';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const { message } = App.useApp();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(params.listingId);
        setListing(data);
      } catch (error) {
        message.error('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.listingId]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const data = await updateListing(params.listingId, {
        ...formData,
        userRef: currentUser._id,
      });
      navigate(`/listing/${data._id}`);
    } catch (error) {
      message.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!listing) {
    return (
      <Typography.Text type="danger" className="block py-24 text-center!">
        Listing not found
      </Typography.Text>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Typography.Title level={3} className="mb-6! text-center!">
        Update a Listing
      </Typography.Title>
      <ListingForm
        initialValues={listing}
        submitLabel="Update listing"
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
