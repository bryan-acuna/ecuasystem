import type { CreateOrderPayload, Order } from '../types/Cart';
import { api } from './api';

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
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query<Order, void>({
      query: () => '/orders',
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation<Order, { orderId: string; details: any }>({
      query: ({ orderId, details }) => {
        console.log('Order ID:', orderId);
        console.log('Payment details:', details);

        return {
          url: `/orders/${orderId}/pay`,
          method: 'PUT',
          body: { ...details },
        };
      },
    }),
    getPayPalClientId: builder.query<{ clientId: string }, void>({
      query: () => '/config/paypal',
      keepUnusedDataFor: 5,
    }),
  }),
});
export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} = ordersApi;
