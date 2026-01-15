import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import cartSliceReducer from '../slices/cartSlices';
import authSliceReducer from '../slices/authSlice';

const rootReducers = combineReducers({
  [api.reducerPath]: api.reducer,
  cart: cartSliceReducer,
  auth: authSliceReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['cart', 'auth'],
  blacklist: ['api.reducerPath'],
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
