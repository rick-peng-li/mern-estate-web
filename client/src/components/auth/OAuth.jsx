import { App, Button } from 'antd';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleSignIn } from '@/redux/user/userSlice';
import { app, isFirebaseConfigured } from '@/utils/firebase';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const handleGoogleClick = async () => {
    if (!isFirebaseConfigured) {
      message.error(
        'Google sign-in is not configured. Please set VITE_FIREBASE_API_KEY in client/.env'
      );
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const action = await dispatch(
        googleSignIn({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        })
      );
      if (action.meta.requestStatus === 'fulfilled') {
        navigate('/');
      }
    } catch (error) {
      message.error('Could not sign in with Google');
    }
  };

  return (
    <Button block className="mt-3" icon={<FcGoogle />} onClick={handleGoogleClick}>
      Continue with Google
    </Button>
  );
}
