import { Card, Text } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import type { Product as ProductType } from '../types/Product';
import Rating from './Rating';

const ProductCard = ({ id, name, image, price, rating, numReviews }: ProductType) => (
  <Card className="product-card" style={{ padding: 0, overflow: 'hidden' }}>
    <Link to={`/product/${id}`}>
      <img src={image} alt={name} className="product-card-image" />
    </Link>
    <div style={{ padding: '12px 14px 14px' }}>
      <Link to={`/product/${id}`} style={{ textDecoration: 'none' }}>
        <div style={{
          fontWeight: 600,
          fontSize: 14,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          marginBottom: 6,
          color: 'var(--gray-12)',
        }}>
          {name}
        </div>
      </Link>
      <Rating rating={rating} numReviews={`${numReviews} reviews`} />
      <Text size="4" weight="bold" style={{ color: 'var(--accent-11)', display: 'block', marginTop: 8 }}>
        ${price}
      </Text>
    </div>
  </Card>
);

export default ProductCard;
