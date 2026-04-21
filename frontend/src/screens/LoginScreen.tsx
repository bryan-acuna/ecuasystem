import { useEffect, useState } from 'react';
import { Button, Card, Heading, Text, TextField, Separator } from '@radix-ui/themes';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { useLoginMutation } from '../services/user';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import GoogleAuthButton from '../components/GoogleAuthButton';
import FormContainer from '../components/FormContainer';

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useAppSelector(state => state.auth);
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success(`Welcome back, ${res.name}!`);
      navigate(redirect);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <FormContainer>
      <Card style={{ marginTop: 32 }}>
        <Heading size="6" mb="4">Sign In</Heading>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label>
              <Text as="div" size="2" weight="medium" mb="1">Email</Text>
              <TextField.Root
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              <Text as="div" size="2" weight="medium" mb="1">Password</Text>
              <TextField.Root
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </label>
            <Button type="submit" size="3" loading={isLoading} style={{ width: '100%' }}>
              Sign In
            </Button>
          </div>
        </form>
        {isLoading && <Loader />}
        <Separator size="4" my="4" />
        <GoogleAuthButton redirect={redirect} />
        <div style={{ marginTop: 16 }}>
          <Text size="2">New Customer? </Text>
          <Link to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}>
            <Text size="2" color="violet">Register</Text>
          </Link>
        </div>
      </Card>
    </FormContainer>
  );
};

export default LoginScreen;
