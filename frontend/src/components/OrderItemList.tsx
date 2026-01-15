import React from 'react';
import type { CartItem } from '../types';
import { Col, Image, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from './Message';

interface OrderItemListProps {
  cartItems: CartItem[];
}

const OrderItemList = ({ cartItems }: OrderItemListProps) => {
  return (
    <div>
      <h2>Order Items</h2>
      {cartItems.length === 0 ? (
        <Message> Your cart is empty</Message>
      ) : (
        <ListGroup>
          {cartItems.map((item, index) => (
            <ListGroup.Item key={index}>
              <Row>
                <Col md={2}>
                  <Image src={item.image} fluid rounded alt={item.name} />
                </Col>
                <Col>
                  <Link to={`/product/${item.productId}`}>{item.name}</Link>
                </Col>
                <Col md={4}>
                  {item.qty} X ${item.price} = $
                  {(item.qty * item.price).toFixed(2)}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default OrderItemList;
