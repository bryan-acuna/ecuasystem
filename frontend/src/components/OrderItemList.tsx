import { Text, Heading } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import type { CartItem } from '../types';
import Message from './Message';

interface OrderItemListProps {
  cartItems: CartItem[];
}

const OrderItemList = ({ cartItems }: OrderItemListProps) => (
  <div>
    <Heading size="4" mb="3">Order Items</Heading>
    {cartItems.length === 0 ? (
      <Message>Your cart is empty</Message>
    ) : (
      <div style={{ border: '1px solid var(--gray-a6)', borderRadius: 'var(--radius-3)', overflow: 'hidden' }}>
        {cartItems.map((item, idx) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderBottom: idx < cartItems.length - 1 ? '1px solid var(--gray-a6)' : 'none',
              flexWrap: 'wrap',
            }}
          >
            <img src={item.image} alt={item.name} className="order-item-image" />
            <div style={{ flex: 1, minWidth: 100 }}>
              <Link to={`/product/${item.id}`} style={{ fontWeight: 500, color: 'var(--accent-11)' }}>
                {item.name}
              </Link>
            </div>
            <Text size="2" style={{ flexShrink: 0 }}>
              {item.qty} × ${item.price} = <strong>${(item.qty * item.price).toFixed(2)}</strong>
            </Text>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default OrderItemList;
