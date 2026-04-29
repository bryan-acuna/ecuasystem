import type { CreateOrderPayload, Order } from '../types/Cart';
import { api } from './api';

export interface PayPalCaptureDetails {
  id?: string;
  status?: string;
  update_time?: string;
  payer?: {
    email_address?: string;
    payer_id?: string;
    name?: { given_name?: string; surname?: string };
  };
}

const ordersApi = api.injectEndpoints({
  endpoints: builder => ({
    createOrder: builder.mutation<Order, CreateOrderPayload>({
      query: order => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetails: builder.query<Order, string>({
      query: orderId => `/orders/${orderId}`,
      keepUnusedDataFor: 60,
    }),
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      keepUnusedDataFor: 60,
    }),
    payOrder: builder.mutation<Order, { orderId: string; details: PayPalCaptureDetails }>({
      query: ({ orderId, details }) => ({
        url: `/orders/${orderId}/pay`,
        method: 'PUT',
        body: { ...details },
      }),
    }),
    getMyOrders: builder.query<Order[], void>({
      query: () => '/orders/mine',
      keepUnusedDataFor: 60,
    }),
    getPayPalClientId: builder.query<{ clientId: string }, void>({
      query: () => '/config/paypal',
      keepUnusedDataFor: 3600,
    }),
  }),
});
export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetMyOrdersQuery,
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} = ordersApi;
