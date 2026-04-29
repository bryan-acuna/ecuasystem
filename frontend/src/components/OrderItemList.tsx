import { Text, Heading } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import type { CartItem } from '../types';
import Message from './Message';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/formatPrice';

interface OrderItemListProps {
  cartItems: CartItem[];
}

const OrderItemList = ({ cartItems }: OrderItemListProps) => {
  const { t } = useTranslation();
  return (
    <div>
      <Heading size="4" mb="3">{t('orderItems.title')}</Heading>
      {cartItems.length === 0 ? (
        <Message>{t('orderItems.empty')}</Message>
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
                {item.qty} × {formatPrice(item.price)} = <strong>{formatPrice(item.qty * item.price)}</strong>
              </Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderItemList;
