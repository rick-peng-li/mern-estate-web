import { useEffect, useState } from 'react';
import { Button, Card, Spin, Tag, Typography } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getPost, getPosts } from '@/api/post.api';
import { POST_CATEGORY, formatDate } from '@/utils/status';

export default function BlogDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    getPost(postId)
      .then(setPost)
      .catch(() => setPost(false));
    getPosts(4)
      .then((posts) => setRelated(posts.filter((p) => p._id !== postId).slice(0, 3)))
      .catch(() => {});
  }, [postId]);

  if (post === null) {
    return (
      <div className="py-24 text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (post === false) {
    return (
      <div className="py-24 text-center">
        <Typography.Title level={4}>Post not found</Typography.Title>
        <Button type="primary" onClick={() => navigate('/blog')}>
          Back to blog
        </Button>
      </div>
    );
  }

  const category = POST_CATEGORY[post.category];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        className="mb-4 px-0!"
        onClick={() => navigate('/blog')}
      >
        Back to all posts
      </Button>
      <Tag color={category.color}>{category.label}</Tag>
      <Typography.Title level={2} className="mt-3!">
        {post.title}
      </Typography.Title>
      <Typography.Text type="secondary">
        By {post.authorName} · {formatDate(post.createdAt)}
      </Typography.Text>
      <img
        src={post.cover}
        alt={post.title}
        className="my-6 h-80 w-full rounded-xl object-cover"
      />
      <div className="flex flex-col gap-4">
        {post.content.split('\n').map((paragraph, index) => (
          <Typography.Paragraph key={index} className="text-base! leading-7!">
            {paragraph}
          </Typography.Paragraph>
        ))}
      </div>

      {related.length > 0 && (
        <Card title="Related posts" className="mt-10">
          <div className="flex flex-col gap-3">
            {related.map((p) => (
              <Link key={p._id} to={`/blog/${p._id}`} className="flex items-center gap-3">
                <img src={p.cover} alt={p.title} className="h-14 w-20 rounded object-cover" />
                <div>
                  <Typography.Text strong className="block">
                    {p.title}
                  </Typography.Text>
                  <Typography.Text type="secondary" className="text-xs!">
                    {formatDate(p.createdAt)}
                  </Typography.Text>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
