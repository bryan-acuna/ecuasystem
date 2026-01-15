import React, { Children } from 'react';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';

interface OrderSummaryCardProps {
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  children?: React.ReactNode;
}

const OrderSummaryCard = ({
  itemsPrice,
  shippingPrice,
  taxPrice,
  totalPrice,
  children,
}: OrderSummaryCardProps) => {
  return (
    <div>
      <Card>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <h2>Order Summary</h2>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Items:</Col>
              <Col>${itemsPrice}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Shipping:</Col>
              <Col>${shippingPrice}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Tax:</Col>
              <Col>${taxPrice}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Total:</Col>
              <Col>${totalPrice}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>{children}</ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
};

export default OrderSummaryCard;
