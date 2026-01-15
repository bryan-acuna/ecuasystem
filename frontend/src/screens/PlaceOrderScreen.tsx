import { Col, ListGroup, Row, Image, Card, Button } from 'react-bootstrap';
import { useAppSelector } from '../store/hook/hooks';
import {
  selectCartItems,
  selectItemsPrice,
  selectPaymentMethod,
  selectShippingAddress,
  selectShippingPrice,
  selectTaxPrice,
  selectTotalPrice,
} from '../slices/cartSlices';
import CheckoutSteps from '../components/CheckoutSteps';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { useCreateOrderMutation } from '../services/orders';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import OrderSummaryCard from '../components/OrderSummaryCard';
import OrderItemList from '../components/OrderItemList';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const shippingAddress = useAppSelector(selectShippingAddress);
  const paymentMethod = useAppSelector(selectPaymentMethod);
  const cartItems = useAppSelector(selectCartItems);
  const itemsPrice = useAppSelector(selectItemsPrice);
  const shippingPrice = useAppSelector(selectShippingPrice);
  const taxPrice = useAppSelector(selectTaxPrice);
  const totalPrice = useAppSelector(selectTotalPrice);

  if (!shippingAddress) {
    navigate('/shipping');
  }
  if (!paymentMethod) {
    navigate('/payment');
  }
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();
      navigate(`/order/${res.id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <CheckoutSteps step1={true} step2={true} step3={true} step4={true} />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>{`Address: ${shippingAddress?.address}, ${shippingAddress?.city} ${shippingAddress?.postalCode}, ${shippingAddress?.country}`}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              {`Method: ${paymentMethod}`}
            </ListGroup.Item>
            <ListGroup.Item>
              <OrderItemList cartItems={cartItems} />
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <OrderSummaryCard
            itemsPrice={itemsPrice}
            shippingPrice={shippingPrice}
            taxPrice={taxPrice}
            totalPrice={totalPrice}
          >
            <Button
              type="button"
              className="btn-block"
              disabled={cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              Place Order
            </Button>
            {isLoading && <Loader />}
          </OrderSummaryCard>
        </Col>
      </Row>
    </>
  );
};
export default PlaceOrderScreen;
