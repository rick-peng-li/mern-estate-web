import { Link } from 'react-router-dom';
import { Button, Empty, Typography } from 'antd';
import ListingItem from '@/components/listing/ListingItem';

export default function ListingSection({ title, linkTo, listings }) {
  if (!listings || listings.length === 0) return null;

  return (
    <section>
      <div className="my-3">
        <Typography.Title level={3}>{title}</Typography.Title>
        <Link to={linkTo}>
          <Button type="link" className="px-0!">
            Show more
          </Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-4">
        {listings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </section>
  );
}

export function EmptyListings({ description = 'No listings found' }) {
  return <Empty description={description} className="my-10" />;
}
