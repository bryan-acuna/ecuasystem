import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import type { Product } from '../types/Product';
import type {
  CartItem,
  CartState,
  PaymentMethod,
  ShippingAddress,
} from '../types';
import { calculateCartTotals } from '../utils/cartUtils';
import type { RootState } from '../store/store';

const initialState: CartState = {
  cartItems: [],
  shippingAddress: null,
  paymentMethod: 'PayPal',
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  totalNumberItems: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.cartItems.find(
        i => i.id === action.payload.id
      );
      if (existingItem) {
        if (existingItem.qty < existingItem.countInStock) {
          existingItem.qty++;
        } else {
          return;
        }
      } else {
        if (action.payload.countInStock < 1) {
          return;
        }
        const item: CartItem = {
          name: action.payload.name,
          image: action.payload.image,
          id: action.payload.id,
          price: action.payload.price,
          countInStock: action.payload.countInStock,
          qty: 1,
        };
        state.cartItems.push(item);
      }
      const totals = calculateCartTotals(state.cartItems);
      Object.assign(state, totals);
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; qty: number }>
    ) => {
      const { productId, qty } = action.payload;
      console.log(state.cartItems);
      console.log(productId);
      if (qty < 1) {
        state.cartItems = state.cartItems.filter(item => item.id !== productId);
      } else {
        const existingItem = state.cartItems.find(i => i.id === productId);
        if (existingItem) {
          existingItem.qty = Math.min(qty, existingItem.countInStock);
        }
      }
      const totals = calculateCartTotals(state.cartItems);
      Object.assign(state, totals);
    },

    removeFromCart: (state, action: PayloadAction<{ id: string }>) => {
      state.cartItems = state.cartItems.filter(
        item => item.productId !== action.payload.id
      );
      const totals = calculateCartTotals(state.cartItems);
      Object.assign(state, totals);
    },
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
    },
    savePaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = action.payload;
    },
    clearCartItems: state => {
      state.cartItems = [];
      const total = calculateCartTotals([]);
      Object.assign(state, total);
    },
    resetCart: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder.addCase(REHYDRATE, (state, action: any) => {
      const persisted = action?.payload?.cart as Partial<CartState> | undefined;
      console.log(action.payload);
      if (!persisted) {
        return state;
      }
      const merged: CartState = {
        ...initialState,
        ...persisted,
        cartItems: Array.isArray(persisted.cartItems)
          ? persisted.cartItems
          : [],
      };

      // Recompute totals from items to avoid drift
      const totals = calculateCartTotals(merged.cartItems);
      return { ...merged, ...totals };
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateItemQuantity,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

// Basic selectors - direct access to state
export const selectCartItems = (state: RootState) => state.cart.cartItems;
export const selectItemsPrice = (state: RootState) => state.cart.itemsPrice;
export const selectShippingPrice = (state: RootState) =>
  state.cart.shippingPrice;
export const selectTaxPrice = (state: RootState) => state.cart.taxPrice;
export const selectTotalPrice = (state: RootState) => state.cart.totalPrice;
export const selectTotalNumberItems = (state: RootState) =>
  state.cart.totalNumberItems;
export const selectShippingAddress = (state: RootState) =>
  state.cart.shippingAddress;
export const selectPaymentMethod = (state: RootState) =>
  state.cart.paymentMethod;

/**
 * Returns the entire cart state (useful for persistence)
 */
export const selectCartState = (state: RootState) => state.cart;

export default cartSlice.reducer;
