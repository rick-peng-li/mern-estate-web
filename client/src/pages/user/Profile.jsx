import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  App,
  Avatar,
  Button,
  Card,
  Flex,
  Form,
  Input,
  List,
  Popconfirm,
  Typography,
  Upload,
} from 'antd';
import { CameraOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  deleteUser,
  updateUser,
  signOutUser,
} from '@/redux/user/userSlice';
import { getUserListings } from '@/api/user.api';
import { deleteListing } from '@/api/listing.api';
import { uploadImageToFirebase } from '@/utils/uploadImage';
import { isFirebaseConfigured } from '@/utils/firebase';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const avatar = Form.useWatch('avatar', form);
  const [filePerc, setFilePerc] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  const handleAvatarUpload = async (file) => {
    if (!isFirebaseConfigured) {
      message.error('Image upload is not configured. Set VITE_FIREBASE_API_KEY in client/.env');
      return false;
    }
    setUploading(true);
    setFilePerc(0);
    try {
      const url = await uploadImageToFirebase(file, setFilePerc);
      form.setFieldsValue({ avatar: url });
      message.success('Avatar uploaded, click Update to save');
    } catch (err) {
      message.error('Image upload failed (image must be less than 2 MB)');
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleSubmit = async (values) => {
    const action = await dispatch(
      updateUser({ userId: currentUser._id, formData: values })
    );
    if (action.meta.requestStatus === 'fulfilled') {
      message.success('User is updated successfully!');
    }
  };

  const handleDeleteUser = async () => {
    const action = await dispatch(deleteUser(currentUser._id));
    if (action.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  const handleSignOut = async () => {
    await dispatch(signOutUser());
    navigate('/');
  };

  const handleShowListings = async () => {
    setListingsLoading(true);
    try {
      const listings = await getUserListings(currentUser._id);
      setUserListings(listings);
    } catch (err) {
      message.error('Error showing listings');
    } finally {
      setListingsLoading(false);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      await deleteListing(listingId);
      setUserListings((prev) => prev.filter((l) => l._id !== listingId));
      message.success('Listing has been deleted!');
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <div className="mx-auto my-10 max-w-lg px-4">
      <Typography.Title level={3} className="text-center!">
        Profile
      </Typography.Title>
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: currentUser.username,
            email: currentUser.email,
            avatar: currentUser.avatar,
          }}
          onFinish={handleSubmit}
          className="text-center"
        >
          <Form.Item name="avatar" hidden>
            <Input />
          </Form.Item>
          <Upload
            showUploadList={false}
            accept="image/*"
            beforeUpload={handleAvatarUpload}
            className="mb-2 self-center"
          >
            <div className="group relative inline-block cursor-pointer">
              <Avatar
                src={avatar || currentUser.avatar}
                alt="profile"
                size={96}
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <CameraOutlined className="text-lg text-white" />
              </div>
            </div>
          </Upload>
          <p className="mb-3 h-5 text-sm">
            {uploading ? (
              <span className="text-slate-600">{`Uploading ${filePerc}%`}</span>
            ) : (
              ''
            )}
          </p>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="username" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input placeholder="email" />
          </Form.Item>
          <Form.Item name="password" label="Password (leave blank to keep)">
            <Input.Password placeholder="password" />
          </Form.Item>
          <Flex vertical gap={8} className="w-full">
            <Button type="primary" htmlType="submit" block loading={loading || uploading}>
              Update
            </Button>
            <Link to="/create-listing" className="block">
              <Button block>Create Listing</Button>
            </Link>
          </Flex>
        </Form>
        <div className="mt-4 flex justify-between">
          <Popconfirm
            title="Delete account"
            description="Are you sure to delete your account?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={handleDeleteUser}
          >
            <Button type="link" danger className="px-0!">
              Delete account
            </Button>
          </Popconfirm>
          <Button type="link" danger className="px-0!" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
        {error && (
          <Typography.Text type="danger" className="mt-3 block">
            {error}
          </Typography.Text>
        )}
      </Card>

      <div className="mt-6 text-center">
        <Button type="link" onClick={handleShowListings} loading={listingsLoading}>
          Show Listings
        </Button>
      </div>

      {userListings.length > 0 && (
        <Card className="mt-4" title="Your Listings">
          <List
            dataSource={userListings}
            renderItem={(listing) => (
              <List.Item
                actions={[
                  <Popconfirm
                    key="delete"
                    title="Delete this listing?"
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => handleListingDelete(listing._id)}
                  >
                    <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </Popconfirm>,
                  <Link key="edit" to={`/update-listing/${listing._id}`}>
                    <Button type="link" size="small" icon={<EditOutlined />}>
                      Edit
                    </Button>
                  </Link>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Link to={`/listing/${listing._id}`}>
                      <img
                        src={listing.imageUrls[0]}
                        alt="listing cover"
                        className="h-16 w-16 rounded object-cover"
                      />
                    </Link>
                  }
                  title={
                    <Link to={`/listing/${listing._id}`}>{listing.name}</Link>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
}
