import { useState } from 'react';
import { Button, Card, Heading, RadioGroup, Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlices';
import type { PaymentMethod } from '../types';
import FormContainer from '../components/FormContainer';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { shippingAddress } = useAppSelector(state => state.cart);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PayPal');

  if (!shippingAddress) {
    navigate('/shipping');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/place-order');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Card style={{ marginTop: 16 }}>
        <Heading size="6" mb="4">Payment Method</Heading>
        <form onSubmit={handleSubmit}>
          <Text as="div" size="2" weight="medium" mb="3">Select Method</Text>
          <RadioGroup.Root
            value={paymentMethod}
            onValueChange={val => setPaymentMethod(val as PaymentMethod)}
            mb="4"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Text as="label" size="3">
                <RadioGroup.Item value="PayPal" /> PayPal or Credit Card
              </Text>
              <Text as="label" size="3">
                <RadioGroup.Item value="Stripe" /> Stripe
              </Text>
            </div>
          </RadioGroup.Root>
          <Button type="submit" size="3">Continue</Button>
        </form>
      </Card>
    </FormContainer>
  );
};

export default PaymentScreen;
