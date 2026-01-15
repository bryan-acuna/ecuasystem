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
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  userApi;
