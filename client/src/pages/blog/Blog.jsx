import { useEffect, useState } from 'react';
import { Card, Col, Empty, Row, Spin, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { getPosts } from '@/api/post.api';
import { POST_CATEGORY, formatDate } from '@/utils/status';

export default function Blog() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  if (!posts) {
    return (
      <div className="py-24 text-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Typography.Title level={3}>Real Estate Insights</Typography.Title>
      <Typography.Paragraph type="secondary">
        Guides, market analysis and lifestyle tips from the Sahand Estate team.
      </Typography.Paragraph>
      {posts.length === 0 ? (
        <Empty description="No posts yet" className="my-16" />
      ) : (
        <Row gutter={[20, 20]}>
          {posts.map((post) => {
            const category = POST_CATEGORY[post.category];
            return (
              <Col xs={24} sm={12} lg={8} key={post._id}>
                <Link to={`/blog/${post._id}`}>
                  <Card
                    hoverable
                    className="h-full"
                    styles={{ body: { padding: 16 } }}
                    cover={
                      <img
                        alt={post.title}
                        src={post.cover}
                        className="h-48 w-full object-cover"
                      />
                    }
                  >
                    <Tag color={category.color}>{category.label}</Tag>
                    <Typography.Title level={5} className="mt-2!" ellipsis={{ rows: 2 }}>
                      {post.title}
                    </Typography.Title>
                    <Typography.Paragraph
                      type="secondary"
                      className="mb-2!"
                      ellipsis={{ rows: 2 }}
                    >
                      {post.content}
                    </Typography.Paragraph>
                    <Typography.Text type="secondary" className="text-xs!">
                      {post.authorName} · {formatDate(post.createdAt)}
                    </Typography.Text>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
