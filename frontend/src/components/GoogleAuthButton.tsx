import { GoogleLogin } from '@react-oauth/google';
import { useAppDispatch } from '../store/hook/hooks';
import { setCredentials } from '../slices/authSlice';
import { useGoogleAuthMutation } from '../services/user';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Props {
  redirect?: string;
}

const GoogleAuthButton = ({ redirect = '/' }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [googleAuth] = useGoogleAuthMutation();

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    try {
      const user = await googleAuth({ credential: credentialResponse.credential }).unwrap();
      dispatch(setCredentials(user));
      toast.success(`Welcome, ${user.name}!`);
      navigate(redirect);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Google sign-in failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google sign-in failed')}
        useOneTap={false}
        theme="outline"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
};

export default GoogleAuthButton;
