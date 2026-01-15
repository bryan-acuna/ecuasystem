import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Col,
  Image,
  ListGroup,
  Row,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import { useGetProductByIdQuery } from '../services/product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useAppDispatch } from '../store/hook/hooks';
import { addToCart } from '../slices/cartSlices';

const ProductScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id: productId } = useParams<{ id: string }>();

  const {
    data: product,
    error,
    isLoading,
  } = useGetProductByIdQuery(productId || '', {
    skip: !productId,
  });

  if (!productId) {
    return (
      <>
        <Link className="btn btn-light my-3" to="/">
          Go Back
        </Link>
        <Message variant="danger">Invalid product ID</Message>
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
            : 'An error occurred while fetching products'}
        </Message>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Link className="btn btn-light my-3" to="/">
          Go Back
        </Link>
        <Alert variant="info">Product not found</Alert>
      </>
    );
  }

  const handleClick = () => {
    if (product) {
      dispatch(addToCart(product));
      navigate('/cart');
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product.image} fluid alt={product.name} />
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                numReviews={`${product.numReviews} reviews`}
                rating={product.rating}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="btn-block w-100"
                  type="button"
                  disabled={product.countInStock === 0}
                  onClick={handleClick}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
