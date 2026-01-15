import { useState } from 'react';
import type { FormEvent } from 'react';
import FormContainer from '../components/FormContainer';
import { Button, Form, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlices';
import type { PaymentMethod } from '../types';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PayPal');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { shippingAddress } = useAppSelector(state => state.cart);

  // Redirect to shipping if no shipping address
  if (!shippingAddress) {
    navigate('/shipping');
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Dispatch payment method to Redux
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/place-order');
  };

  return (
    <FormContainer>
      <CheckoutSteps step3={true} step1={true} step2={true} />
      <h1>Payment Method</h1>
      <Form onSubmit={handleSubmit} className="text-start">
        <Form.Group className="my-3">
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
            />
            <Form.Check
              type="radio"
              className="my-2"
              label="Stripe"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              checked={paymentMethod === 'Stripe'}
              onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
            />
          </Col>
        </Form.Group>

        <Button className="mt-2" variant="primary" type="submit">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
