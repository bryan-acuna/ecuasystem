import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';
import type { RootState } from '../store/store';

interface AuthState {
  userInfo: User | null;
}

const initialState: AuthState = {
  userInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
    },
    removeCredentials: state => {
      state.userInfo = null;
    },
  },
});

export const { setCredentials, removeCredentials } = authSlice.actions;
export default authSlice.reducer;

export const selectUserInfo = (state: RootState) => state.auth.userInfo;
