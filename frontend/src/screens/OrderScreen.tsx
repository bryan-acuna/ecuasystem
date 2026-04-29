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
import { useTranslation } from 'react-i18next';

const OrderScreen = () => {
  const { t } = useTranslation();
  const { id: orderId } = useParams<{ id: string }>();
  const { data: order, error, isLoading, refetch } = useGetOrderDetailsQuery(orderId || '', { skip: !orderId });
  const { data: paypalConfig, isLoading: isLoadingPayPal } = useGetPayPalClientIdQuery();
  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();

  const paypalOptions = useMemo(
    () => ({ clientId: paypalConfig?.clientId ?? '', currency: 'USD', intent: 'capture' }),
    [paypalConfig?.clientId]
  );

  const GoBack = (
    <Link to="/"><Button variant="outline" size="2" mb="4"><ArrowLeft size={14} /> {t('order.goBack')}</Button></Link>
  );

  if (!orderId) return <>{GoBack}<Message variant="danger">{t('order.invalidId')}</Message></>;
  if (isLoading) return <Loader />;
  if (error) return <>{GoBack}<Message variant="danger">{'status' in error ? `Error: ${error.status}` : 'An error occurred'}</Message></>;
  if (!order) return <>{GoBack}<Message variant="info">{t('order.notFound')}</Message></>;

  const handlePaymentSuccess = async (details: any) => {
    try {
      await payOrder({ orderId: order.id, details: { id: details.id, status: details.status, update_time: details.update_time, payer: details.payer } }).unwrap();
      refetch();
      toast.success(t('order.paymentSuccess'));
    } catch { toast.error(t('order.paymentFailed')); }
  };

  return (
    <>
      {GoBack}
      <Heading size="6" mb="4">{t('order.title')} {order.id}</Heading>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 24, alignItems: 'start' }}
        className="order-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <Heading size="4" mb="3">{t('order.shipping')}</Heading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Text size="2"><strong>{t('order.name')}</strong> {order.user.name}</Text>
              <Text size="2"><strong>{t('order.email')}</strong> {order.user.email}</Text>
              <Text size="2"><strong>{t('order.address')}</strong> {`${order.shippingAddress?.address}, ${order.shippingAddress?.city} ${order.shippingAddress?.postalCode}, ${order.shippingAddress?.country}`}</Text>
            </div>
            <div style={{ marginTop: 8 }}>
              {order.isDelivered
                ? <Message variant="success">{t('order.delivered')} {order.deliveredAt}</Message>
                : <Message variant="danger">{t('order.notDelivered')}</Message>}
            </div>
          </Card>
          <Card>
            <Heading size="4" mb="2">{t('order.paymentMethod')}</Heading>
            <Text>{t('order.method')} {order.paymentMethod}</Text>
            <div style={{ marginTop: 8 }}>
              {order.isPaid
                ? <Message variant="success">{t('order.paid')} {order.paidAt}</Message>
                : <Message variant="danger">{t('order.notPaid')}</Message>}
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
                      onError={() => toast.error(t('order.paymentFailed'))}
                    />
                  )}
                </PayPalScriptProvider>
              ) : (
                <Message variant="danger">{t('order.paypalNotConfigured')}</Message>
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
