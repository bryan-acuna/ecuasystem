import { useEffect, useState } from 'react';
import { Button, Card, Heading, Text, TextField, Separator } from '@radix-ui/themes';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { setCredentials } from '../slices/authSlice';
import { useGetProfileQuery, useUpdateProfileMutation } from '../services/user';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useTranslation } from 'react-i18next';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(state => state.auth);

  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { data: profile, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password.length < 6) { toast.error(t('profile.passwordShort')); return; }
    if (password && password !== confirmPassword) { toast.error(t('profile.passwordMismatch')); return; }
    try {
      const updated = await updateProfile({
        name,
        email,
        ...(password && { password }),
      }).unwrap();
      dispatch(setCredentials(updated));
      setPassword('');
      setConfirmPassword('');
      toast.success(t('profile.updateSuccess'));
    } catch (err: any) {
      toast.error(err?.data?.message || t('profile.errorLoading'));
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{t('profile.errorLoading')}</Message>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <Card style={{ marginTop: 16 }}>
          <Heading size="6" mb="1">{t('profile.title')}</Heading>
          {userInfo?.isAdmin && <Text size="2" color="gray">{t('profile.admin')}</Text>}
          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">{t('profile.name')}</Text>
                <TextField.Root value={name} onChange={e => setName(e.target.value)} required />
              </label>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">{t('profile.email')}</Text>
                <TextField.Root type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>
              <Separator size="4" />
              <Text size="2" color="gray" weight="medium">{t('profile.changePassword')}</Text>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">{t('profile.newPassword')}</Text>
                <TextField.Root type="password" placeholder={t('profile.newPasswordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} />
              </label>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">{t('profile.confirmNewPassword')}</Text>
                <TextField.Root type="password" placeholder={t('profile.confirmNewPasswordPlaceholder')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </label>
              <Button type="submit" size="3" loading={isUpdating}>{t('profile.saveChanges')}</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileScreen;
