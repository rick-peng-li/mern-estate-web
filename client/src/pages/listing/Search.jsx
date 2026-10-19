import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Button, Checkbox, Empty, Form, Input, Radio, Select, Spin, Typography } from 'antd';
import { getListings } from '@/api/listing.api';
import ListingItem from '@/components/listing/ListingItem';

const SORT_OPTIONS = [
  { value: 'regularPrice_desc', label: 'Price high to low' },
  { value: 'regularPrice_asc', label: 'Price low to high' },
  { value: 'createdAt_desc', label: 'Latest' },
  { value: 'createdAt_asc', label: 'Oldest' },
];

const readParamsFromUrl = (search) => {
  const urlParams = new URLSearchParams(search);
  const sort = urlParams.get('sort') || 'createdAt';
  const order = urlParams.get('order') || 'desc';
  return {
    searchTerm: urlParams.get('searchTerm') || '',
    type: urlParams.get('type') || 'all',
    parking: urlParams.get('parking') === 'true',
    furnished: urlParams.get('furnished') === 'true',
    offer: urlParams.get('offer') === 'true',
    sort,
    order,
    sort_order: `${sort}_${order}`,
  };
};

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const filters = readParamsFromUrl(location.search);

  useEffect(() => {
    form.setFieldsValue(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      try {
        const data = await getListings(searchParams);
        if (data.length > 8) {
          setShowMore(true);
        }
        setListings(data);
      } catch (error) {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleSubmit = (values) => {
    const [sort = 'createdAt', order = 'desc'] = (values.sort_order || '').split('_');
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', values.searchTerm || '');
    urlParams.set('type', values.type || 'all');
    urlParams.set('parking', values.parking || false);
    urlParams.set('furnished', values.furnished || false);
    urlParams.set('offer', values.offer || false);
    urlParams.set('sort', sort);
    urlParams.set('order', order);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', listings.length);
    try {
      const data = await getListings(urlParams);
      if (data.length < 9) {
        setShowMore(false);
      }
      setListings((prev) => [...prev, ...data]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <aside className="w-full border-b-2 border-slate-200 p-7 md:min-h-screen md:w-80 md:border-r-2">
        <Typography.Title level={4}>Filters:</Typography.Title>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={filters}>
          <Form.Item name="searchTerm" label="Search Term">
            <Input placeholder="Search..." allowClear />
          </Form.Item>
          <Form.Item name="type" label="Type">
            <Radio.Group>
              <Radio value="all">Rent & Sale</Radio>
              <Radio value="rent">Rent</Radio>
              <Radio value="sale">Sale</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="offer" valuePropName="checked" label="Offer">
            <Checkbox>Only listings with offer</Checkbox>
          </Form.Item>
          <Form.Item label="Amenities" className="mb-2!">
            <div className="flex flex-wrap gap-4">
              <Form.Item name="parking" valuePropName="checked" noStyle>
                <Checkbox>Parking</Checkbox>
              </Form.Item>
              <Form.Item name="furnished" valuePropName="checked" noStyle>
                <Checkbox>Furnished</Checkbox>
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item name="sort_order" label="Sort">
            <Select options={SORT_OPTIONS} placeholder="Sort by" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Search
          </Button>
        </Form>
      </aside>

      <div className="flex-1">
        <Typography.Title level={3} className="border-b p-3!">
          Listing results:
        </Typography.Title>
        <div className="flex flex-wrap gap-4 p-7">
          {loading && (
            <div className="w-full py-16 text-center">
              <Spin size="large" />
            </div>
          )}
          {!loading && listings.length === 0 && (
            <Empty description="No listing found!" className="w-full my-16" />
          )}
          {!loading &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <Button
              type="link"
              onClick={onShowMoreClick}
              className="w-full! text-center! text-green-700!"
            >
              Show more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
