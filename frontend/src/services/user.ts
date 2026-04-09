import type { User } from '../types';
import { api } from './api';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
interface LogoutResponse {
  message: string;
}

type LoginRequest = Omit<RegisterRequest, 'name'>;

interface UpdateProfileRequest {
  name: string;
  email: string;
  password?: string;
}

export const userApi = api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<User, LoginRequest>({
      query: credentials => ({
        url: '/users/auth',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
    }),
    register: builder.mutation<User, RegisterRequest>({
      query: credentials => ({
        url: '/users',
        method: 'POST',
        body: credentials,
      }),
    }),
    googleAuth: builder.mutation<User, { credential: string }>({
      query: body => ({
        url: '/users/auth/google',
        method: 'POST',
        body,
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => '/users/profile',
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: data => ({
        url: '/users/profile',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi;
