import { Button, Card, Heading, Select, Text } from '@radix-ui/themes';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { removeFromCart, updateItemQuantity } from '../slices/cartSlices';
import { useCallback, useMemo } from 'react';
import Message from '../components/Message';
import { useTranslation } from 'react-i18next';

const CartScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cartItems, itemsPrice, totalNumberItems } = useAppSelector(state => state.cart);

  const handleQtyChange = useCallback((productId: string, qty: number) => {
    dispatch(updateItemQuantity({ productId, qty }));
  }, [dispatch]);

  const handleDelete = useCallback((id: string) => {
    if (!window.confirm(t('cart.confirmRemove'))) return;
    dispatch(removeFromCart({ id }));
  }, [dispatch, t]);

  const formattedPrice = useMemo(() => itemsPrice.toFixed(2), [itemsPrice]);

  if (cartItems.length === 0) {
    return (
      <Message variant="info">
        <div>{t('cart.empty')} <Link to="/">{t('cart.continueShopping')}</Link></div>
      </Message>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}
        className="cart-grid">

        {/* Items */}
        <div>
          <Heading size="5" mb="3">{t('cart.title')}</Heading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cartItems.map(item => (
              <Card key={item.id} style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 6, flexShrink: 0, background: 'var(--gray-2)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/product/${item.id}`}
                      style={{ fontWeight: 600, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray-12)' }}
                    >
                      {item.name}
                    </Link>
                    <Text size="3" weight="bold" style={{ color: 'var(--accent-11)' }}>${item.price}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <Select.Root
                      value={String(item.qty)}
                      onValueChange={val => handleQtyChange(item.id, Number(val))}
                      disabled={item.countInStock === 0}
                      size="1"
                    >
                      <Select.Trigger style={{ width: 68 }} />
                      <Select.Content>
                        {Array.from({ length: item.countInStock }, (_, i) => (
                          <Select.Item key={i + 1} value={String(i + 1)}>{i + 1}</Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                    <Button
                      color="red"
                      variant="soft"
                      size="1"
                      onClick={() => handleDelete(item.id)}
                      aria-label={t('cart.removeItem')}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary */}
        <Card>
          <Heading size="4" mb="2">
            {t('cart.subtotal')} ({totalNumberItems} {totalNumberItems === 1 ? t('cart.item') : t('cart.items')})
          </Heading>
          <Text size="6" weight="bold">${formattedPrice}</Text>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button
              size="3"
              style={{ width: '100%' }}
              disabled={totalNumberItems === 0}
              onClick={() => navigate('/login?redirect=/shipping')}
            >
              <ShoppingCart size={16} /> {t('cart.checkout')}
            </Button>
            <Link to="/">
              <Button variant="outline" size="2" style={{ width: '100%' }}>{t('cart.continueShopping')}</Button>
            </Link>
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CartScreen;
