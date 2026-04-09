import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { useLoginMutation } from '../services/user';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import GoogleAuthButton from '../components/GoogleAuthButton';

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useAppSelector(state => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success(`Welcome back, ${res.name}!`);
      navigate(redirect);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || 'Invalid email or password');
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={handleSubmit} className="text-start">
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

        <Button
          disabled={isLoading}
          className="mt-2 w-100"
          variant="primary"
          type="submit"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
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
          New Customer?{' '}
          <Link to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
