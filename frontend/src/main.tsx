import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/styles/index.css';
import './assets/styles/bootstrap.custom.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router';
// import 'bootstrap/dist/css/bootstrap.min.css'
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />}></Route>
      <Route path="/login" element={<LoginScreen />}></Route>
      <Route path="/register" element={<RegisterScreen />}></Route>
      <Route path="/cart" element={<CartScreen />}></Route>

      <Route path="/product/:id" element={<ProductScreen />}></Route>

      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />}></Route>
        <Route path="/payment" element={<PaymentScreen />}></Route>
        <Route path="/place-order" element={<PlaceOrderScreen />}></Route>
        <Route path="/order/:id" element={<OrderScreen />}></Route>
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
