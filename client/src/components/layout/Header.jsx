import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Dropdown, Input, Space } from 'antd';
import { FaBars, FaHome, FaInfoCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { signOutUser } from '@/redux/user/userSlice';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('searchTerm') || '');
  }, [location.search]);

  const handleSearch = (value) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', value || '');
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleSignOut = async () => {
    await dispatch(signOutUser());
    navigate('/');
  };

  const menuItems = [
    {
      key: 'about',
      icon: <FaInfoCircle />,
      label: <Link to="/about">About</Link>,
    },
    currentUser
      ? {
          key: 'profile',
          icon: <FaUser />,
          label: <Link to="/profile">Profile</Link>,
        }
      : {
          key: 'signin',
          icon: <FaUser />,
          label: <Link to="/sign-in">Sign In</Link>,
        },
    ...(currentUser
      ? [
          { type: 'divider' },
          {
            key: 'signout',
            icon: <FaSignOutAlt />,
            label: 'Sign Out',
            onClick: handleSignOut,
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Space size={16} className="min-w-0 flex-1">
          <Link to="/" className="whitespace-nowrap">
            <span className="text-sm font-bold sm:text-lg">
              <span className="text-slate-500">Sahand</span>
              <span className="text-slate-800">Estate</span>
            </span>
          </Link>
          <Input.Search
            placeholder="Search listings..."
            allowClear
            enterButton
            className="max-w-72"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
          />
        </Space>
        <Space size={4}>
          <Link to="/">
            <Button type="text" icon={<FaHome />}>
              Home
            </Button>
          </Link>
          <Dropdown
            menu={{ items: menuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            {currentUser ? (
              <Avatar
                src={currentUser.avatar}
                alt="profile"
                className="cursor-pointer"
              />
            ) : (
              <Button type="text" icon={<FaBars />} aria-label="menu" />
            )}
          </Dropdown>
        </Space>
      </div>
    </header>
  );
}
