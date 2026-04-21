import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@radix-ui/themes/styles.css';
import './assets/styles/index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router';
import App from './App.tsx';
import HomeScreen from './screens/HomeScreen.tsx';
import ProductScreen from './screens/ProductScreen.tsx';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store.ts';
import CartScreen from './screens/CartScreen.tsx';
import LoginScreen from './screens/LoginScreen.tsx';
import RegisterScreen from './screens/RegisterScreen.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import ShippingScreen from './screens/ShippingScreen.tsx';
import PaymentScreen from './screens/PaymentScreen.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import OrderScreen from './screens/OrderScreen.tsx';
import { PersistGate } from 'redux-persist/integration/react';
import PlaceOrderScreen from './screens/PlaceOrderScreen.tsx';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import CategoryScreen from './screens/CategoryScreen.tsx';
import AdminProductScreen from './screens/AdminProductScreen.tsx';
import AdminProductListScreen from './screens/AdminProductListScreen.tsx';
import AdminProductEditScreen from './screens/AdminProductEditScreen.tsx';
import AdminRoute from './components/AdminRoute.tsx';
import ProfileScreen from './screens/ProfileScreen.tsx';
import MyOrdersScreen from './screens/MyOrdersScreen.tsx';
import SearchScreen from './screens/SearchScreen.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/category/:category" element={<CategoryScreen />} />
      <Route path="/search" element={<SearchScreen />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/my-orders" element={<MyOrdersScreen />} />
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/place-order" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/product/new" element={<AdminProductScreen />} />
        <Route path="/admin/products" element={<AdminProductListScreen />} />
        <Route path="/admin/product/:id/edit" element={<AdminProductEditScreen />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <PayPalScriptProvider options={{ clientId: 'sb' }} deferLoading>
                <RouterProvider router={router} />
              </PayPalScriptProvider>
            </PersistGate>
          </Provider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
