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
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '../utils/getErrorMessage';
import { sanitizeRedirect } from '../utils/sanitizeRedirect';

const RegisterScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useAppSelector(state => state.auth);
  const { search } = useLocation();
  const redirect = sanitizeRedirect(new URLSearchParams(search).get('redirect'));

  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error(t('auth.passwordShort')); return; }
    if (password !== confirmPassword) { toast.error(t('auth.passwordMismatch')); return; }
    try {
      const user = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(user));
      toast.success(t('auth.welcomeNew', { name: user.name }));
    } catch (err) {
      toast.error(getErrorMessage(err, t('auth.registrationFailed')));
    }
  };

  return (
    <FormContainer>
      <Card style={{ marginTop: 32 }}>
        <Heading size="6" mb="4">{t('auth.register')}</Heading>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label>
              <Text as="div" size="2" weight="medium" mb="1">{t('auth.name')}</Text>
              <TextField.Root placeholder={t('auth.enterName')} value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
              <Text as="div" size="2" weight="medium" mb="1">{t('auth.email')}</Text>
              <TextField.Root type="email" placeholder={t('auth.enterEmail')} value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
              <Text as="div" size="2" weight="medium" mb="1">{t('auth.password')}</Text>
              <TextField.Root type="password" placeholder={t('auth.enterPassword')} value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <label>
              <Text as="div" size="2" weight="medium" mb="1">{t('auth.confirmPassword')}</Text>
              <TextField.Root type="password" placeholder={t('auth.enterConfirmPassword')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </label>
            <Button type="submit" size="3" loading={isLoading} style={{ width: '100%' }}>
              {t('auth.register')}
            </Button>
          </div>
        </form>
        {isLoading && <Loader />}
        <Separator size="4" my="4" />
        <GoogleAuthButton redirect={redirect} />
        <div style={{ marginTop: 16 }}>
          <Text size="2">{t('auth.returningCustomer')} </Text>
          <Link to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'}>
            <Text size="2" color="violet">{t('auth.loginLink')}</Text>
          </Link>
        </div>
      </Card>
    </FormContainer>
  );
};

export default RegisterScreen;
