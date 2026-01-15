import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: '/api' });

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: () => ({}),
});
