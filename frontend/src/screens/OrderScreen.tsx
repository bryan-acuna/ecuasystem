import { Alert, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
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

  const {
    data: order,
    error,
    isLoading,
    refetch,
  } = useGetOrderDetailsQuery(orderId || '', {
    skip: !orderId,
  });
  const { data: paypalConfig, isLoading: isLoadingPayPal } =
    useGetPayPalClientIdQuery();

  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();

  const paypalOptions = useMemo(
    () => ({
      clientId: paypalConfig?.clientId ?? '',
      currency: 'USD',
      intent: 'capture',
    }),
    [paypalConfig?.clientId]
  );

  if (!orderId) {
    return (
      <>
        <Link className="btn btn-light my-3" to="/">
          Go Back
        </Link>
        <Message variant="danger">Invalid ORDER ID</Message>
      </>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <Link className="btn btn-light my-3" to="/">
          Go Back
        </Link>
        <Message variant="danger">
          {'status' in error
            ? `Error: ${error.status}`
            : 'An error occurred while fetching order'}
        </Message>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Link className="btn btn-light my-3" to="/">
          Go Back
        </Link>
        <Alert variant="info">Order not found</Alert>
      </>
    );
  }

  const handlePaymentSuccess = async (details: any) => {
    console.log('details', details);
    console.log('id', order.id);
    try {
      await payOrder({
        orderId: order.id,
        details: {
          id: details.id,
          status: details.status,
          update_time: details.update_time,
          payer: details.payer,
        },
      }).unwrap();

      refetch();
      toast.success('Payment successful!');
    } catch (err) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', err);
    }
  };

  const handlePaymentError = (error: any) => {
    toast.error('Payment failed. Please try again.');
    console.error('PayPal error:', error);
  };

  return (
    <>
      <h1>Order {order?.id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order?.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order?.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {`${order?.shippingAddress?.address}, ${order?.shippingAddress?.city} ${order?.shippingAddress?.postalCode}, ${order?.shippingAddress?.country}`}
              </p>

              {order?.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order?.paymentMethod}
              </p>
              {order?.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <OrderItemList cartItems={order.orderItems} />
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <OrderSummaryCard
            itemsPrice={order?.itemsPrice}
            shippingPrice={order?.shippingPrice}
            taxPrice={order?.taxPrice}
            totalPrice={order?.totalPrice}
          />
          {!order.isPaid && (
            <Card className="mt-3">
              <Card.Body>
                {isLoadingPayPal ? (
                  <Loader />
                ) : paypalConfig?.clientId ? (
                  <PayPalScriptProvider options={paypalOptions}>
                    {isPaying ? (
                      <Loader />
                    ) : (
                      <PayPalButtons style={{ layout: 'vertical' }} />
                    )}
                  </PayPalScriptProvider>
                ) : (
                  <Message variant="danger">
                    PayPal is not configured. Please contact support.
                  </Message>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
