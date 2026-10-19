import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { App, Button, Card, Form, Input, Typography } from 'antd';
import { signUp } from '@/api/auth.api';
import OAuth from '@/components/auth/OAuth';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await signUp(values);
      message.success('Account created successfully! Please sign in.');
      navigate('/sign-in');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-16 max-w-md px-4">
      <Card>
        <Typography.Title level={3} className="text-center!">
          Sign Up
        </Typography.Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="username" autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="email" autoComplete="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="password" autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign Up
          </Button>
          <OAuth />
        </Form>
        <div className="mt-5 flex justify-center gap-1">
          <Typography.Text>Have an account?</Typography.Text>
          <Link to="/sign-in">
            <Typography.Link>Sign in</Typography.Link>
          </Link>
        </div>
      </Card>
    </div>
  );
}
