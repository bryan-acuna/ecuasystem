import { Button, Card, Heading, Text } from '@radix-ui/themes';
import { useAppSelector } from '../store/hook/hooks';
import {
  selectCartItems, selectItemsPrice, selectPaymentMethod,
  selectShippingAddress, selectShippingPrice, selectTaxPrice, selectTotalPrice,
} from '../slices/cartSlices';
import CheckoutSteps from '../components/CheckoutSteps';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../services/orders';
import { toast } from 'react-toastify';
import OrderSummaryCard from '../components/OrderSummaryCard';
import OrderItemList from '../components/OrderItemList';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const shippingAddress = useAppSelector(selectShippingAddress);
  const paymentMethod   = useAppSelector(selectPaymentMethod);
  const cartItems       = useAppSelector(selectCartItems);
  const itemsPrice      = useAppSelector(selectItemsPrice);
  const shippingPrice   = useAppSelector(selectShippingPrice);
  const taxPrice        = useAppSelector(selectTaxPrice);
  const totalPrice      = useAppSelector(selectTotalPrice);

  if (!shippingAddress) navigate('/shipping');
  if (!paymentMethod)   navigate('/payment');

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress: shippingAddress!,
        paymentMethod: paymentMethod!,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();
      navigate(`/order/${res.id}`);
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 24, alignItems: 'start' }}
        className="placeorder-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <Heading size="4" mb="3">Shipping</Heading>
            <Text size="2" color="gray">
              {`${shippingAddress?.address}, ${shippingAddress?.city} ${shippingAddress?.postalCode}, ${shippingAddress?.country}`}
            </Text>
          </Card>
          <Card>
            <Heading size="4" mb="2">Payment Method</Heading>
            <Text>Method: {paymentMethod}</Text>
          </Card>
          <Card>
            <OrderItemList cartItems={cartItems} />
          </Card>
        </div>
        <OrderSummaryCard
          itemsPrice={itemsPrice}
          shippingPrice={shippingPrice}
          taxPrice={taxPrice}
          totalPrice={totalPrice}
        >
          <Button
            size="3"
            style={{ width: '100%', marginTop: 16 }}
            disabled={cartItems.length === 0}
            onClick={placeOrderHandler}
            loading={isLoading}
          >
            Place Order
          </Button>
        </OrderSummaryCard>
      </div>
      <style>{`
        @media (max-width: 768px) { .placeorder-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
};

export default PlaceOrderScreen;
