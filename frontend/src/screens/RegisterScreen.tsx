import React, { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../services/user';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

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
    if (password != '' && password === confirmPassword) {
      try {
        const user = await register({
          name,
          password,
          email,
        }).unwrap();
        dispatch(setCredentials({ ...user }));
      } catch (err: any) {
        toast.error(err?.data?.message || err?.error || 'Login failed');
      }
    } else {
      toast.error('Password do not match');
      return;
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
          />
        </Form.Group>
        <Form.Group className="my-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="my-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="my-3" controlId="confirm-password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
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
