import { useEffect, useState } from 'react';
import { Button, Card, Heading, Text, TextField, Separator } from '@radix-ui/themes';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../services/user';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import GoogleAuthButton from '../components/GoogleAuthButton';
import FormContainer from '../components/FormContainer';

const RegisterScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useAppSelector(state => state.auth);
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    try {
      const user = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(user));
      toast.success(`Welcome, ${user.name}! Your account has been created.`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Registration failed');
    }
  };

  return (
    <FormContainer>
      <Card style={{ marginTop: 32 }}>
        <Heading size="6" mb="4">Register</Heading>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label>
              <Text as="div" size="2" weight="medium" mb="1">Name</Text>
              <TextField.Root placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
              <Text as="div" size="2" weight="medium" mb="1">Email</Text>
              <TextField.Root type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
              <Text as="div" size="2" weight="medium" mb="1">Password</Text>
              <TextField.Root type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <label>
              <Text as="div" size="2" weight="medium" mb="1">Confirm Password</Text>
              <TextField.Root type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </label>
            <Button type="submit" size="3" loading={isLoading} style={{ width: '100%' }}>
              Register
            </Button>
          </div>
        </form>
        {isLoading && <Loader />}
        <Separator size="4" my="4" />
        <GoogleAuthButton redirect={redirect} />
        <div style={{ marginTop: 16 }}>
          <Text size="2">Returning Customer? </Text>
          <Link to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'}>
            <Text size="2" color="violet">Login</Text>
          </Link>
        </div>
      </Card>
    </FormContainer>
  );
};

export default RegisterScreen;
