import { useState } from 'react';
import type { FormEvent } from 'react';
import FormContainer from '../components/FormContainer';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import {
  saveShippingAddress,
  selectShippingAddress,
} from '../slices/cartSlices';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
  const shippingAddress = useAppSelector(selectShippingAddress);
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <>
      <CheckoutSteps step1={true} step2={true} />
      <FormContainer>
        <h1>Shipping</h1>
        <Form onSubmit={handleSubmit} className="text-start">
          <Form.Group className="my-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="my-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="my-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="my-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter country"
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          <Button className="mt-2" variant="primary" type="submit">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
