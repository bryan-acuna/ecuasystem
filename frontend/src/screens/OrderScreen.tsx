import { Button, Card, Heading, Text } from '@radix-ui/themes';
import { ArrowLeft } from 'lucide-react';
import Message from '../components/Message';
import { Link, useParams } from 'react-router-dom';
import {
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} from '../services/orders';
import Loader from '../components/Loader';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useMemo } from 'react';
import OrderSummaryCard from '../components/OrderSummaryCard';
import OrderItemList from '../components/OrderItemList';

const OrderScreen = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const { data: order, error, isLoading, refetch } = useGetOrderDetailsQuery(orderId || '', { skip: !orderId });
  const { data: paypalConfig, isLoading: isLoadingPayPal } = useGetPayPalClientIdQuery();
  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();

  const paypalOptions = useMemo(
    () => ({ clientId: paypalConfig?.clientId ?? '', currency: 'USD', intent: 'capture' }),
    [paypalConfig?.clientId]
  );

  const GoBack = (
    <Link to="/"><Button variant="outline" size="2" mb="4"><ArrowLeft size={14} /> Go Back</Button></Link>
  );

  if (!orderId) return <>{GoBack}<Message variant="danger">Invalid ORDER ID</Message></>;
  if (isLoading) return <Loader />;
  if (error) return <>{GoBack}<Message variant="danger">{'status' in error ? `Error: ${error.status}` : 'An error occurred'}</Message></>;
  if (!order) return <>{GoBack}<Message variant="info">Order not found</Message></>;

  const handlePaymentSuccess = async (details: any) => {
    try {
      await payOrder({ orderId: order.id, details: { id: details.id, status: details.status, update_time: details.update_time, payer: details.payer } }).unwrap();
      refetch();
      toast.success('Payment successful!');
    } catch { toast.error('Payment failed. Please try again.'); }
  };

  return (
    <>
      {GoBack}
      <Heading size="6" mb="4">Order {order.id}</Heading>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 24, alignItems: 'start' }}
        className="order-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <Heading size="4" mb="3">Shipping</Heading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Text size="2"><strong>Name:</strong> {order.user.name}</Text>
              <Text size="2"><strong>Email:</strong> {order.user.email}</Text>
              <Text size="2"><strong>Address:</strong> {`${order.shippingAddress?.address}, ${order.shippingAddress?.city} ${order.shippingAddress?.postalCode}, ${order.shippingAddress?.country}`}</Text>
            </div>
            <div style={{ marginTop: 8 }}>
              {order.isDelivered
                ? <Message variant="success">Delivered on {order.deliveredAt}</Message>
                : <Message variant="danger">Not Delivered</Message>}
            </div>
          </Card>
          <Card>
            <Heading size="4" mb="2">Payment Method</Heading>
            <Text>Method: {order.paymentMethod}</Text>
            <div style={{ marginTop: 8 }}>
              {order.isPaid
                ? <Message variant="success">Paid on {order.paidAt}</Message>
                : <Message variant="danger">Not Paid</Message>}
            </div>
          </Card>
          <Card>
            <OrderItemList cartItems={order.orderItems} />
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <OrderSummaryCard
            itemsPrice={order.itemsPrice}
            shippingPrice={order.shippingPrice}
            taxPrice={order.taxPrice}
            totalPrice={order.totalPrice}
          />
          {!order.isPaid && (
            <Card>
              {isLoadingPayPal ? <Loader /> : paypalConfig?.clientId ? (
                <PayPalScriptProvider options={paypalOptions}>
                  {isPaying ? <Loader /> : (
                    <PayPalButtons
                      style={{ layout: 'vertical' }}
                      onApprove={(_data, actions) => actions.order!.capture().then(handlePaymentSuccess)}
                      onError={() => toast.error('Payment failed. Please try again.')}
                    />
                  )}
                </PayPalScriptProvider>
              ) : (
                <Message variant="danger">PayPal is not configured. Please contact support.</Message>
              )}
            </Card>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .order-grid { grid-template-columns: 1fr !important; } }`}</style>
    </>
  );
};

export default OrderScreen;
