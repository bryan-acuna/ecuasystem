import React from 'react';
import { useAppSelector } from '../store/hook/hooks';
import { selectUserInfo } from '../slices/authSlice';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const userInfo = useAppSelector(selectUserInfo);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
