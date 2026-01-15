import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import Message from '../components/Message';
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { removeFromCart, updateItemQuantity } from '../slices/cartSlices';
import { useCallback, useMemo } from 'react';

/**
 * CartScreen Component
 * Displays the shopping cart with items, quantities, and checkout functionality
 */
const CartScreen = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cartItems, itemsPrice, totalNumberItems } = useAppSelector(
    state => state.cart
  );
  const handleQtyChange = useCallback(
    (productId: string, qty: number) => {
      dispatch(updateItemQuantity({ productId, qty }));
    },
    [dispatch]
  );
  const handleDelete = useCallback(
    (id: string) => {
      if (!window.confirm('Are you sure you want to remove this item?')) {
        return;
      }
      dispatch(removeFromCart({ id }));
    },
    [dispatch]
  );
  const handleCheckout = useCallback(() => {
    navigate('/login?redirect=/shipping');
  }, [navigate]);
  const formattedPrice = useMemo(() => itemsPrice.toFixed(2), [itemsPrice]);
  if (cartItems.length === 0) {
    return (
      <Message variant="info">
        <h1>Your Cart Is Empty</h1>
        <p>Start shopping to add items to your cart.</p>
        <Link to="/" className="btn btn-primary mt-3">
          Continue Shopping
        </Link>
      </Message>
    );
  }
  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
        <ListGroup>
          {cartItems.map(item => (
            <ListGroup.Item key={item.id}>
              <Row>
                <Col md={2}>
                  <Image src={item.image} alt={item.name} fluid rounded />
                </Col>
                <Col md={3}>
                  <Link to={`/product/${item.id}`}>{item.name}</Link>
                </Col>
                <Col md={2}>${item.price}</Col>
                <Col md={2}>
                  <Form.Control
                    as="select"
                    value={item.qty}
                    onChange={e =>
                      handleQtyChange(item.id, Number(e.target.value))
                    }
                    aria-label={`Quantity for ${item.name}`} // NEW!
                    disabled={item.countInStock === 0}
                  >
                    {[...Array(item.countInStock).keys()].map(x => (
                      <option key={x + 0} value={x + 0}>
                        {x + 0}
                      </option>
                    ))}
                  </Form.Control>
                  {item.countInStock === 0 && (
                    <small className="text-danger">Out of Stock</small>
                  )}
                </Col>
                <Col md={2}>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    type="button"
                    variant="light"
                    aria-label={`Remove ${item.name} from cart`}
                    title="Remove item"
                  >
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({totalNumberItems}){' '}
                {totalNumberItems === 1 ? 'Item' : 'Items'}
              </h2>
              <h3 className="mt-2">${formattedPrice}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid">
                <Button
                  onClick={handleCheckout}
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={totalNumberItems === 0}
                >
                  Checkout
                </Button>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to="/" className="btn btn-outline-secondary w-100">
                Continue Shopping
              </Link>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
