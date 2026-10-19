import { useEffect, useState } from 'react';
import { Button, Input, Typography } from 'antd';
import { getUser } from '@/api/user.api';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setLandlord(await getUser(listing.userRef));
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  if (!landlord) return null;

  return (
    <div className="flex flex-col gap-3">
      <Typography.Text>
        Contact <span className="font-semibold">{landlord.username}</span> for{' '}
        <span className="font-semibold">{listing.name.toLowerCase()}</span>
      </Typography.Text>
      <Input.TextArea
        rows={2}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message here..."
      />
      <Button
        type="primary"
        block
        href={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
      >
        Send Message
      </Button>
    </div>
  );
}
