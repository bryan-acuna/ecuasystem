import React, { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../services/user';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import GoogleAuthButton from '../components/GoogleAuthButton';

const RegisterScreen = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const { userInfo } = useAppSelector(state => state.auth);

  const { search } = location;
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const user = await register({ name, password, email }).unwrap();
      dispatch(setCredentials({ ...user }));
      toast.success(`Welcome, ${user.name}! Your account has been created.`);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || 'Registration failed');
    }
  };

  return (
    <FormContainer>
      <h1>Register </h1>
      <Form onSubmit={handleSubmit} className="text-start">
        <Form.Group className="my-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="my-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="my-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="my-3" controlId="confirm-password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button
          disabled={isLoading}
          className="mt-2"
          variant="primary"
          type="submit"
        >
          Register
        </Button>
        {isLoading && <Loader />}
      </Form>

      <div className="d-flex align-items-center my-3 gap-2">
        <hr className="flex-grow-1 m-0" />
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>or</span>
        <hr className="flex-grow-1 m-0" />
      </div>

      <GoogleAuthButton redirect={redirect} />

      <Row className="py-3">
        <Col>
          Returning Customer?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
