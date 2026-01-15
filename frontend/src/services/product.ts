import type { Product } from '../types/Product';
import { api } from './api';

export const productApi = api.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    getProductById: builder.query<Product, string>({
      query: id => `/products/${id}`,
      keepUnusedDataFor: 5,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi;
