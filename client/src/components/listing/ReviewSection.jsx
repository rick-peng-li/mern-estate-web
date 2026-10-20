import { useEffect, useState } from 'react';
import { App, Avatar, Button, Card, Empty, Form, Input, Rate, Tag, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  createReview,
  deleteReview,
  getListingReviews,
} from '@/api/review.api';
import { formatDate } from '@/utils/status';

export default function ReviewSection({ listing }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [data, setData] = useState({ reviews: [], average: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  const loadReviews = () => {
    getListingReviews(listing._id)
      .then(setData)
      .catch(() => {});
  };

  useEffect(loadReviews, [listing._id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await createReview({
        listingId: listing._id,
        rating: values.rating,
        comment: values.comment,
        username: currentUser.username,
        avatar: currentUser.avatar,
      });
      message.success('Review submitted!');
      form.resetFields();
      loadReviews();
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      message.success('Review deleted');
      loadReviews();
    } catch (error) {
      message.error(error.message);
    }
  };

  const myReview = currentUser
    ? data.reviews.find((r) => r.user === currentUser._id)
    : null;

  return (
    <Card title={`Reviews (${data.total})`} className="mt-6">
      {data.total > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <Rate disabled allowHalf value={data.average} />
          <Typography.Text strong>{data.average.toFixed(1)}</Typography.Text>
          <Typography.Text type="secondary">average rating</Typography.Text>
        </div>
      )}
      {data.total === 0 && <Empty description="No reviews yet" />}
      <div className="flex flex-col gap-4">
        {data.reviews.map((review) => (
          <div key={review._id} className="flex gap-3 border-b border-gray-100 pb-4">
            <Avatar src={review.avatar} alt={review.username} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Typography.Text strong>{review.username}</Typography.Text>
                <Rate disabled value={review.rating} className="text-sm!" />
                <Typography.Text type="secondary" className="text-xs!">
                  {formatDate(review.createdAt)}
                </Typography.Text>
                {currentUser?._id === review.user && (
                  <Button
                    type="link"
                    danger
                    size="small"
                    className="ml-auto px-0!"
                    onClick={() => handleDelete(review._id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <Typography.Paragraph className="mb-0! mt-1!">
                {review.comment}
              </Typography.Paragraph>
            </div>
          </div>
        ))}
      </div>
      {currentUser ? (
        myReview ? (
          <Tag color="blue" className="mt-4">
            You have reviewed this listing. Submitting again updates your review.
          </Tag>
        ) : null
      ) : (
        <Button type="link" className="mt-4 px-0!" onClick={() => navigate('/sign-in')}>
          Sign in to write a review
        </Button>
      )}
      {currentUser && (
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="rating" label="Your rating" rules={[{ required: true, message: 'Please rate' }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="Comment" rules={[{ required: true, message: 'Please write a comment' }]}>
            <Input.TextArea rows={3} placeholder="Share your experience..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit review
          </Button>
        </Form>
      )}
    </Card>
  );
}
