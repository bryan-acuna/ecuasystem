import type { User } from './User';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CartState {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod | null;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  totalNumberItems: number;
}

export type PaymentMethod = 'PayPal' | 'CreditCard' | 'Stripe';

export interface CreateOrderPayload {
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

export interface Order extends CreateOrderPayload {
  id: string;
  userId: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, 'email' | 'name'>;
}
