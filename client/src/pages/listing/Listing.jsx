import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { App, Button, Result, Spin, Tag, Typography } from 'antd';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import { getListing } from '@/api/listing.api';
import Contact from '@/components/listing/Contact';
import ReviewSection from '@/components/listing/ReviewSection';
import FavoriteButton from '@/components/favorite/FavoriteButton';
import BookingModal from '@/components/booking/BookingModal';
import { formatPrice } from '@/utils/format';

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { message } = App.useApp();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await getListing(params.listingId);
        setListing(data);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Link copied!');
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <Result
        status="warning"
        title="Something went wrong!"
        subTitle="This listing may have been removed."
      />
    );
  }

  return (
    <main>
      <Swiper navigation modules={[Navigation]}>
        {listing.imageUrls.map((url) => (
          <SwiperSlide key={url}>
            <div
              className="h-[550px]"
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: 'cover',
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="fixed top-[13%] right-[3%] z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white shadow-md">
        <FaShare className="text-slate-500" onClick={handleShare} />
      </div>

      <div className="fixed top-[20%] right-[3%] z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white shadow-md">
        <FavoriteButton listingId={listing._id} />
      </div>

      <div className="mx-auto my-7 flex max-w-4xl flex-col gap-4 p-3">
        <Typography.Title level={2} className="mb-0!">
          {listing.name} - ${formatPrice(listing.offer ? listing.discountPrice : listing.regularPrice)}
          {listing.type === 'rent' && <span className="text-lg"> / month</span>}
        </Typography.Title>
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <FaMapMarkerAlt className="text-green-700" />
          {listing.address}
        </p>
        <div className="flex flex-wrap gap-2">
          <Tag color="red" className="px-4 py-1 text-sm">
            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
          </Tag>
          {listing.offer && (
            <Tag color="green" className="px-4 py-1 text-sm">
              ${+listing.regularPrice - +listing.discountPrice} OFF
            </Tag>
          )}
        </div>
        <Typography.Paragraph className="text-base!">
          <span className="font-semibold text-black">Description - </span>
          {listing.description}
        </Typography.Paragraph>
        <ul className="flex flex-wrap items-center gap-4 text-sm font-semibold text-green-900 sm:gap-6">
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBed className="text-lg" />
            {listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaBath className="text-lg" />
            {listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaParking className="text-lg" />
            {listing.parking ? 'Parking spot' : 'No Parking'}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap">
            <FaChair className="text-lg" />
            {listing.furnished ? 'Furnished' : 'Unfurnished'}
          </li>
        </ul>
        {currentUser && listing.userRef !== currentUser._id && !contact && (
          <div className="flex flex-wrap gap-3">
            <BookingModal listing={listing} />
            <Button onClick={() => setContact(true)} className="w-fit!">
              Contact landlord
            </Button>
          </div>
        )}
        {contact && <Contact listing={listing} />}
        <ReviewSection listing={listing} />
      </div>
    </main>
  );
}
