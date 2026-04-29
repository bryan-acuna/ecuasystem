import { Button, Card, Heading, Text } from '@radix-ui/themes';
import { useAppSelector } from '../store/hook/hooks';
import {
  selectCartItems, selectItemsPrice, selectPaymentMethod,
  selectShippingAddress, selectShippingPrice, selectTaxPrice, selectTotalPrice,
} from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../services/orders';
import { toast } from 'react-toastify';
import OrderSummaryCard from '../components/OrderSummaryCard';
import OrderItemList from '../components/OrderItemList';
import { useTranslation } from 'react-i18next';

const PlaceOrderScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const shippingAddress = useAppSelector(selectShippingAddress);
  const paymentMethod   = useAppSelector(selectPaymentMethod);
  const cartItems       = useAppSelector(selectCartItems);
  const itemsPrice      = useAppSelector(selectItemsPrice);
  const shippingPrice   = useAppSelector(selectShippingPrice);
  const taxPrice        = useAppSelector(selectTaxPrice);
  const totalPrice      = useAppSelector(selectTotalPrice);

  if (!shippingAddress) return <Navigate to="/shipping" replace />;
  if (!paymentMethod)   return <Navigate to="/payment" replace />;

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
            <Heading size="4" mb="3">{t('placeOrder.shipping')}</Heading>
            <Text size="2" color="gray">
              {`${shippingAddress?.address}, ${shippingAddress?.city} ${shippingAddress?.postalCode}, ${shippingAddress?.country}`}
            </Text>
          </Card>
          <Card>
            <Heading size="4" mb="2">{t('placeOrder.paymentMethod')}</Heading>
            <Text>{t('placeOrder.method')} {paymentMethod}</Text>
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
            {t('placeOrder.placeOrder')}
          </Button>
        </OrderSummaryCard>
      </div>
    </>
  );
};

export default PlaceOrderScreen;
