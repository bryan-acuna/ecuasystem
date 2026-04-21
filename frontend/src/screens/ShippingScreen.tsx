import { useState } from 'react';
import { Button, Card, Heading, Text, TextField } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { saveShippingAddress, selectShippingAddress } from '../slices/cartSlices';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';

const ShippingScreen = () => {
  const shippingAddress = useAppSelector(selectShippingAddress);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [address, setAddress]       = useState(shippingAddress?.address    || '');
  const [city, setCity]             = useState(shippingAddress?.city        || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode  || '');
  const [country, setCountry]       = useState(shippingAddress?.country     || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
      <FormContainer>
        <Card style={{ marginTop: 16 }}>
          <Heading size="6" mb="4">Shipping</Heading>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">Address</Text>
                <TextField.Root placeholder="Enter address" value={address} onChange={e => setAddress(e.target.value)} required />
              </label>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">City</Text>
                <TextField.Root placeholder="Enter city" value={city} onChange={e => setCity(e.target.value)} required />
              </label>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">Postal Code</Text>
                <TextField.Root placeholder="Enter postal code" value={postalCode} onChange={e => setPostalCode(e.target.value)} required />
              </label>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">Country</Text>
                <TextField.Root placeholder="Enter country" value={country} onChange={e => setCountry(e.target.value)} required />
              </label>
              <Button type="submit" size="3">Continue</Button>
            </div>
          </form>
        </Card>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
