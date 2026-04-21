import { useEffect, useState } from 'react';
import { Button, Card, Heading, Text, TextField, Separator } from '@radix-ui/themes';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { setCredentials } from '../slices/authSlice';
import { useGetProfileQuery, useUpdateProfileMutation } from '../services/user';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProfileScreen = () => {
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
    if (password && password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password && password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    try {
      const updated = await updateProfile({
        name,
        email,
        ...(password && { password }),
      }).unwrap();
      dispatch(setCredentials(updated));
      setPassword('');
      setConfirmPassword('');
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update profile');
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">Failed to load profile</Message>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <Card style={{ marginTop: 16 }}>
          <Heading size="6" mb="1">My Profile</Heading>
          {userInfo?.isAdmin && <Text size="2" color="gray">Administrator account</Text>}
          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">Name</Text>
                <TextField.Root value={name} onChange={e => setName(e.target.value)} required />
              </label>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">Email</Text>
                <TextField.Root type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>
              <Separator size="4" />
              <Text size="2" color="gray" weight="medium">Change Password (optional)</Text>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">New Password</Text>
                <TextField.Root type="password" placeholder="Leave blank to keep current" value={password} onChange={e => setPassword(e.target.value)} />
              </label>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">Confirm New Password</Text>
                <TextField.Root type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </label>
              <Button type="submit" size="3" loading={isUpdating}>Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileScreen;
