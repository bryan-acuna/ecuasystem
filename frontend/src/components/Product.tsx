import { Card } from 'react-bootstrap';
import type { Product } from '../types/Product';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ id, name, image, price, rating, numReviews }: Product) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${id}`}>
        <Card.Img src={image} variant="top"></Card.Img>
      </Link>
      <Card.Body>
        <Link to={`/product/${id}`}>
          <Card.Title className="product-title" as="div">
            <strong>{name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating numReviews={`${numReviews} reviews`} rating={rating} />
        </Card.Text>
        <Card.Text as="h3">${price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
