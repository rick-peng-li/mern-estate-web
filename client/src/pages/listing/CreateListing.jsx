import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Typography } from 'antd';
import { createListing } from '@/api/listing.api';
import ListingForm from '@/components/listing/ListingForm';

const INITIAL_VALUES = {
  name: '',
  description: '',
  address: '',
  type: 'rent',
  bedrooms: 1,
  bathrooms: 1,
  regularPrice: 50,
  discountPrice: 0,
  offer: false,
  parking: false,
  furnished: false,
};

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const data = await createListing({ ...formData, userRef: currentUser._id });
      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Typography.Title level={3} className="mb-6! text-center!">
        Create a Listing
      </Typography.Title>
      <ListingForm
        initialValues={INITIAL_VALUES}
        submitLabel="Create listing"
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
