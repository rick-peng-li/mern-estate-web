import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Form, Input, Typography } from 'antd';
import { signInUser } from '@/redux/user/userSlice';
import OAuth from '@/components/auth/OAuth';

export default function SignIn() {
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const action = await dispatch(signInUser(values));
    if (action.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <div className="mx-auto my-16 max-w-md px-4">
      <Card>
        <Typography.Title level={3} className="text-center!">
          Sign In
        </Typography.Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input placeholder="email" autoComplete="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="password" autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign In
          </Button>
          <OAuth />
        </Form>
        <div className="mt-5 flex justify-center gap-1">
          <Typography.Text>Don't have an account?</Typography.Text>
          <Link to="/sign-up">
            <Typography.Link>Sign up</Typography.Link>
          </Link>
        </div>
        {error && (
          <Typography.Text type="danger" className="mt-4 block text-center!">
            {error}
          </Typography.Text>
        )}
      </Card>
    </div>
  );
}
