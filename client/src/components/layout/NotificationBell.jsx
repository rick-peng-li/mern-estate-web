import { useEffect, useState } from 'react';
import { Badge, Button, Dropdown, Empty, Popover, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMyNotifications, markAllRead } from '@/api/notification.api';
import { formatDateTime } from '@/utils/status';

export default function NotificationBell() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [data, setData] = useState({ notifications: [], unread: 0 });
  const [open, setOpen] = useState(false);

  const load = () => {
    if (!currentUser) return;
    getMyNotifications()
      .then(setData)
      .catch(() => {});
  };

  useEffect(load, [currentUser]);

  const handleMarkAll = async () => {
    await markAllRead();
    load();
  };

  if (!currentUser) return null;

  const content = (
    <div className="w-80">
      <div className="mb-2 flex items-center justify-between">
        <Typography.Text strong>Notifications</Typography.Text>
        {data.unread > 0 && (
          <Button type="link" size="small" className="px-0!" onClick={handleMarkAll}>
            Mark all read
          </Button>
        )}
      </div>
      {data.notifications.length === 0 ? (
        <Empty description="No notifications" className="my-4" />
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {data.notifications.map((n) => (
            <div
              key={n._id}
              className={`cursor-pointer rounded-lg p-2 ${n.read ? '' : 'bg-blue-50'}`}
              onClick={() => {
                setOpen(false);
                if (n.link) navigate(n.link);
              }}
            >
              <Typography.Text strong className="block text-sm!">
                {n.title}
              </Typography.Text>
              <Typography.Paragraph className="mb-0! text-xs! text-gray-500" ellipsis={{ rows: 2 }}>
                {n.message}
              </Typography.Paragraph>
              <Typography.Text type="secondary" className="text-xs!">
                {formatDateTime(n.createdAt)}
              </Typography.Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottomRight">
      <Badge count={data.unread} size="small">
        <Button type="text" icon={<BellOutlined />} aria-label="notifications" />
      </Badge>
    </Popover>
  );
}
