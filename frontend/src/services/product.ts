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
    getProductsByCategory: builder.query<Product[], string>({
      query: category => `/products?category=${encodeURIComponent(category)}`,
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<Product, Omit<Product, 'id' | 'rating' | 'numReviews'>>({
      query: product => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useCreateProductMutation,
} = productApi;
