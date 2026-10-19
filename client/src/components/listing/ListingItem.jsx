import { Link } from 'react-router-dom';
import { Card, Typography } from 'antd';
import { MdLocationOn } from 'react-icons/md';
import { formatPrice } from '@/utils/format';

export default function ListingItem({ listing }) {
  return (
    <Link to={`/listing/${listing._id}`} className="block w-full sm:w-[330px]">
      <Card
        hoverable
        className="h-full overflow-hidden"
        styles={{ body: { padding: 12 } }}
        cover={
          <img
            alt={listing.name}
            src={listing.imageUrls[0]}
            className="h-[220px] w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        }
      >
        <p className="truncate text-lg font-semibold text-slate-700">
          {listing.name}
        </p>
        <p className="flex items-center gap-1 text-sm text-gray-500">
          <MdLocationOn className="shrink-0 text-green-700" />
          <span className="truncate">{listing.address}</span>
        </p>
        <Typography.Paragraph
          type="secondary"
          className="mb-1! mt-1!"
          ellipsis={{ rows: 2 }}
        >
          {listing.description}
        </Typography.Paragraph>
        <p className="font-semibold text-slate-700">
          ${formatPrice(listing.offer ? listing.discountPrice : listing.regularPrice)}
          {listing.type === 'rent' && ' / month'}
        </p>
        <p className="mt-1 text-xs font-bold text-slate-700">
          {listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'} ·{' '}
          {listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}
          {listing.offer && (
            <span className="ml-2 rounded bg-green-700 px-1.5 py-0.5 text-white">
              Offer
            </span>
          )}
        </p>
      </Card>
    </Link>
  );
}
