import type { CartItem } from '../types/Cart';

const CART_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 100,
  SHIPPING_COST: 10,
  TAX_RATE: 0.15,
} as const;

const roundToTwo = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
export const calculateCartTotals = (items: CartItem[]) => {
  const itemsPrice = roundToTwo(
    items.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return total + price * qty;
    }, 0)
  );
  const shippingPrice =
    itemsPrice >= CART_CONFIG.FREE_SHIPPING_THRESHOLD
      ? 0
      : CART_CONFIG.SHIPPING_COST;
  const taxPrice = roundToTwo(itemsPrice * CART_CONFIG.TAX_RATE);
  const totalPrice = roundToTwo(itemsPrice + shippingPrice + taxPrice);
  const totalNumberItems = items.reduce(
    (total, item) => total + (Number(item.qty) || 0),
    0
  );
  return { itemsPrice, shippingPrice, taxPrice, totalPrice, totalNumberItems };
};
