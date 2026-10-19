import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Button, Typography } from 'antd';
import 'swiper/css';
import 'swiper/css/navigation';
import { getListings } from '@/api/listing.api';
import ListingSection, { EmptyListings } from '@/components/listing/ListingSection';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeListings = async () => {
      try {
        const [offers, rent, sale] = await Promise.all([
          getListings({ offer: true, limit: 4 }),
          getListings({ type: 'rent', limit: 4 }),
          getListings({ type: 'sale', limit: 4 }),
        ]);
        setOfferListings(offers);
        setRentListings(rent);
        setSaleListings(sale);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeListings();
  }, []);

  return (
    <div>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-3 py-24">
        <Typography.Title className="text-3xl! sm:text-5xl! lg:text-6xl!">
          Find your next <span className="text-green-700">perfect</span>
          <br />
          place with ease
        </Typography.Title>
        <div className="text-sm text-gray-400 sm:text-base">
          Sahand Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to="/search" className="w-fit">
          <Button type="link" className="px-0! text-base! font-bold!">
            Let's get started...
          </Button>
        </Link>
      </div>

      {offerListings.length > 0 && (
        <Swiper navigation modules={[Navigation]}>
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="mx-auto my-10 flex max-w-6xl flex-col gap-8 p-3">
        {loading ? (
          <EmptyListings description="Loading listings..." />
        ) : (
          <>
            <ListingSection
              title="Recent offers"
              linkTo="/search?offer=true"
              listings={offerListings}
            />
            <ListingSection
              title="Recent places for rent"
              linkTo="/search?type=rent"
              listings={rentListings}
            />
            <ListingSection
              title="Recent places for sale"
              linkTo="/search?type=sale"
              listings={saleListings}
            />
          </>
        )}
      </div>
    </div>
  );
}
