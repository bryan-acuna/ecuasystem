import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { setCredentials } from '../slices/authSlice';
import { useGetProfileQuery, useUpdateProfileMutation } from '../services/user';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(state => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { data: profile, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password && password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

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
      toast.error(err?.data?.message || err?.error || 'Failed to update profile');
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">Failed to load profile</Message>;

  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <Card className="p-4">
          <h1 className="mb-1">My Profile</h1>
          {userInfo?.isAdmin && (
            <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>
              Administrator account
            </p>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <hr className="my-4" />
            <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
              Leave password fields blank to keep your current password.
            </p>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
