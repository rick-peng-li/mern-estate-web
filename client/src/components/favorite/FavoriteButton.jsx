import { useEffect, useState } from 'react';
import { App, Button } from 'antd';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkFavorite, toggleFavorite } from '@/api/favorite.api';

export default function FavoriteButton({ listingId }) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    checkFavorite(listingId)
      .then((data) => setFavorited(data.favorited))
      .catch(() => {});
  }, [listingId, currentUser]);

  const handleToggle = async () => {
    if (!currentUser) {
      message.info('Please sign in to save favorites');
      navigate('/sign-in');
      return;
    }
    try {
      const data = await toggleFavorite(listingId);
      setFavorited(data.favorited);
      message.success(data.favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Button
      shape="circle"
      size="large"
      icon={
        favorited ? (
          <FaHeart className="text-red-500!" />
        ) : (
          <FaRegHeart className="text-slate-500!" />
        )
      }
      onClick={handleToggle}
      aria-label="favorite"
    />
  );
}
