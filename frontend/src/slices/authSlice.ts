import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';
import type { RootState } from '../store/store';

interface AuthState {
  userInfo: User | null;
}

const getUserFromStorage = (): User | null => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Failed to parse userInfo from localStorage:', error);
    return null;
  }
};

const initialState: AuthState = {
  userInfo: getUserFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    removeCredentials: state => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, removeCredentials } = authSlice.actions;
export default authSlice.reducer;

export const selectUserInfo = (state: RootState) => state.auth.userInfo;
